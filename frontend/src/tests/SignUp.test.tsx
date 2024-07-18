import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SignUp from '../components/auth/SignUp';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SignUp Component', () => {
  test('renders SignUp form', () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/accounts/signup/',
        {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/check your email for a confirmation link/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed submission', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Failed to sign up'));

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/accounts/signup/',
        {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to sign up/i)).toBeInTheDocument();
    });
  });
});
