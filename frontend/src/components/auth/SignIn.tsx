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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

const theme = createTheme();

interface LoginValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { login, resendVerificationEmail } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: LoginValues, { setSubmitting, setStatus }: FormikHelpers<LoginValues>) => {
    try {
      await login(values.email, values.password);
    } catch (error: any) {
      console.error('Error during login:', error);
      const errorData = JSON.parse(error.message);
      if (errorData.non_field_errors && errorData.non_field_errors.includes("E-mail is not verified.")) {
        setStatus({ submit: "E-mail is not verified. Please verify your email." });
        await resendVerificationEmail(values.email);
      } else {
        setStatus({ submit: error.message || 'An error occurred' });
      }
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
          <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="success.main">
            Log In
          </Typography>
          <Formik<LoginValues>
            initialValues={{ email: '', password: '' }}
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(status?.email)}
                  InputLabelProps={{ style: { color: 'green' } }} // Add green to input label
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'green',
                        },
                        '&:hover fieldset': {
                          borderColor: 'green',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'green',
                        },
                      },
                    },
                  }}
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
                  InputLabelProps={{ style: { color: 'green' } }}
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'green',
                        },
                        '&:hover fieldset': {
                          borderColor: 'green',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'green',
                        },
                      },
                    },
                  }}
                />
                {status?.submit && (
                  <Typography color="error" variant="body2">
                    {status.submit}
                  </Typography>
                )}
                <FormControlLabel
                  control={<Checkbox value="remember" color="success" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  Log In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" color="success.main">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup" variant="body2" color="success.main">
                      {"Don't have an account? Sign Up"}
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

export default SignIn;
