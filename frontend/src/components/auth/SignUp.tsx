import React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { getCSRFToken } from '../../utils/csrf';

const theme = createTheme();

interface SignUpValues {
  username: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (
    values: SignUpValues,
    { setSubmitting, setStatus }: FormikHelpers<SignUpValues>
  ) => {
    console.log('Submitting form with values:', values);  // Log form values
    try {
      const csrfToken = await getCSRFToken();
      console.log('CSRF token:', csrfToken);  // Log the CSRF token
      const response = await axios.post(
        'http://localhost:8000/accounts/signup/',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log('Signup response data:', response.data);  // Log response data
    } catch (error: any) {
      console.error('Error during signup request:', error);  // Log any error
      if (error.response) {
        console.error('Response data:', error.response.data);  // Log response data
        console.error('Response status:', error.response.status);  // Log response status
        console.error('Response headers:', error.response.headers);  // Log response headers
      }
      setStatus({ submit: error.response?.data?.error || 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Formik<SignUpValues>
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form noValidate>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  helperText={<ErrorMessage name="username" />}
                  error={Boolean(status?.username)}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(status?.email)}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(status?.password)}
                />
                {status?.submit && (
                  <Typography color="error" variant="body2">
                    {status.submit}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
