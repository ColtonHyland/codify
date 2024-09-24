from django.shortcuts import redirect

class RedirectAuthenticatedUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the user is authenticated and trying to access the login page
        if request.path == '/login/' and request.user.is_authenticated:
            return redirect('/')  # Redirect to home if authenticated

        response = self.get_response(request)
        return response
