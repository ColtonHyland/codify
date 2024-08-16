
# Codify

Codify is a full-stack application designed to help users generate and solve JavaScript coding problems using an in-browser editor. The app features a frontend built with React and Material-UI, and a backend built with Django and Docker for code execution.

## Getting Started

To get started with the project, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

\`\`\`bash
git clone https://github.com/yourusername/codify.git
\`\`\`

### 2. Navigate to the Project Directory

Change into the project's root directory:

\`\`\`bash
cd codify
\`\`\`

### 3. Set Up the Backend

1. Navigate to the backend directory:

   \`\`\`bash
   cd backend
   \`\`\`

2. Create a virtual environment:

   \`\`\`bash
   python -m venv venv
   \`\`\`

3. Activate the virtual environment:

   - On Windows:
     \`\`\`bash
     venv\Scriptsctivate
     \`\`\`
   - On macOS/Linux:
     \`\`\`bash
     source venv/bin/activate
     \`\`\`

4. Install the required dependencies:

   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

5. Apply migrations to set up the database:

   \`\`\`bash
   python manage.py migrate
   \`\`\`

6. Create a superuser for Django admin access:

   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

7. Run the Django development server:

   \`\`\`bash
   python manage.py runserver
   \`\`\`

### 4. Set Up the Frontend

1. Navigate to the frontend directory:

   \`\`\`bash
   cd ../frontend
   \`\`\`

2. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

3. Run the React development server:

   \`\`\`bash
   npm start
   \`\`\`

### 5. Running Docker (Optional)

If you prefer running the backend inside a Docker container, you can build and run it with the following commands:

1. Build the Docker image:

   \`\`\`bash
   docker build -t codify-backend .
   \`\`\`

2. Run the Docker container:

   \`\`\`bash
   docker run -p 8000:8000 codify-backend
   \`\`\`

## Available Scripts

In the project directory, you can run:

### \`npm start\`

Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.You will also see any lint errors in the console.

### \`npm test\`

Launches the test runner in the interactive watch mode.See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### \`npm run build\`

Builds the app for production to the \`build\` folder.It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### \`npm run eject\`

**Note: this is a one-way operation. Once you \`eject\`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can \`eject\` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except \`eject\` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use \`eject\`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Testing

### Backend

To run the backend tests, use the following command:

\`\`\`bash
python manage.py test
\`\`\`

### Frontend

To run the frontend tests, use the following command:

\`\`\`bash
npm test
\`\`\`

## License

This project is licensed under the MIT License - see the \`LICENSE\` file for details.

## Contact

For questions or feedback, please reach out to the project maintainer.
