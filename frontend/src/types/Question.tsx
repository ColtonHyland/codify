export interface Question {
  id: string;
  problem_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  categories: string[];
  language: string;
  description: string;
  design: string;
  design_solution: string;
  task: string;
  example_input: string;
  example_output: string;
  explanation: string;
  explanation_answer: string;
  input_constraints: string;
  tests: string;
  hints: string;
  tags: string;
  notes: string;
}
