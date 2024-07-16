# Codify Development Setup

This guide will help you set up the development environment for the Codify project.

## Prerequisites

- Python 3.12 or later
- PostgreSQL
- Node.js (for frontend, if applicable)
- Git

## Initial Setup

1. **Clone the Repository**
    ```bash
    git clone https://github.com/ColtonHyland/codify.git
    cd codify
    ```

2. **Set Up Virtual Environment**
    ```bash
    python -m venv venv
    .\venv\Scripts\Activate
    ```

3. **Install Backend Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4. **Set Up Environment Variables**
    - Create a `.env` file in the `backend` directory with the following content:
      ```env
      SECRET_KEY=your_secret_key
      DEBUG=True
      ALLOWED_HOSTS=localhost,127.0.0.1
      DATABASE_NAME=codify_db
      DATABASE_USER=codify_user
      DATABASE_PASSWORD=password
      DATABASE_HOST=localhost
      DATABASE_PORT=5432
      OPENAI_API_KEY=your_openai_api_key
      ```

5. **Apply Database Migrations**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. **Create a Superuser (Optional)**
    ```bash
    python manage.py createsuperuser
    ```

7. **Run the Development Server**
    ```bash
    python manage.py runserver
    ```

## Running Tests

1. **Run Tests**
    ```bash
    python manage.py test api.tests
    ```

## Directory Structure

- `backend/` - Contains the Django backend project.
- `frontend/` - Contains the frontend project (if applicable).
- `venv/` - Virtual environment directory.

## Common Issues

- **ModuleNotFoundError: No module named 'dotenv'**
  - Ensure you have installed all dependencies using `pip install -r requirements.txt`.
  
- **Database connection issues**
  - Ensure PostgreSQL is running and the credentials in the `.env` file are correct.

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/en/5.0/)
- [OpenAI API Documentation](https://beta.openai.com/docs/)
