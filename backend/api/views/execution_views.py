import logging
import os
import subprocess
import tempfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def execute_code_js(request):
    try:
        data = request.data
        code = data.get('code')
        test_cases = data.get('test_cases', [])
        logger.debug(f"Received code for execution:\n{code}")
        logger.debug(f"Received test cases:\n{test_cases}")

        if not code or not test_cases:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        with tempfile.TemporaryDirectory() as tmpdirname:
            code_file_path = os.path.join(tmpdirname, 'script.js')

            with open(code_file_path, 'w') as code_file:
                code_file.write(code)
                code_file.write('\n\n')

                code_file.write("console.log('Running dynamic tests:');\n")
                for i, test_case in enumerate(test_cases):
                    input_data = test_case['input']
                    expected_output = test_case.get('expected_output')
                    if expected_output is None:
                        logger.error(f"Missing 'expected_output' in test case {i + 1}")
                        return JsonResponse({'error': f"Missing 'expected_output' in test case {i + 1}"}, status=400)

                    code_file.write(f"const actual_output_{i + 1} = {input_data};\n")
                    code_file.write(f"console.log('Test {i + 1} Output:', actual_output_{i + 1});\n")
                    code_file.write(f"if (String(actual_output_{i + 1}) === String({expected_output})) {{\n")
                    code_file.write(f"    console.log('Test {i + 1} Passed');\n")
                    code_file.write("} else {\n")
                    code_file.write(f"    console.log('Test {i + 1} Failed: Expected {expected_output} but got', actual_output_{i + 1});\n")
                    code_file.write("}\n\n")

            try:
                result = subprocess.run(
                    ['docker', 'run', '--rm', '-v', f'{tmpdirname}:/usr/src/app', 'node:14', 'node', '/usr/src/app/script.js'],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=10,
                )

                output = result.stdout.decode().strip()
                error = result.stderr.decode().strip()

                passed_tests = [f"Test {i + 1}" for i, _ in enumerate(test_cases) if f"Test {i + 1} Passed" in output]
                failed_tests = [f"Test {i + 1}" for i, _ in enumerate(test_cases) if f"Test {i + 1} Failed" in output]

                return JsonResponse({
                    'passed_tests': passed_tests,
                    'failed_tests': failed_tests,
                    'error': error
                }, status=200)

            except subprocess.TimeoutExpired:
                logger.error("Docker execution timed out")
                return JsonResponse({'error': 'Docker execution timed out'}, status=500)
            except subprocess.CalledProcessError as e:
                logger.error(f"Subprocess error: {str(e)}")
                return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': f"Unexpected error: {str(e)}"}, status=500)
