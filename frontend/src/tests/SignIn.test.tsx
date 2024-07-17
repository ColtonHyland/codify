import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignIn from '../components/auth/SignIn';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

describe('SignIn Component', () => {
  test('renders SignIn form', () => {
    render(<SignIn />);

    // Check if form elements are rendered
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<SignIn />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check if axios.post was called with correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/accounts/login/',
      {
        email: 'test@example.com',
        password: 'password123',
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
  });

  test('displays error message on failed submission', async () => {
    (axios.post as jest.Mock).mockRejectedValue(new Error('Sign-in failed'));

    render(<SignIn />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check if error message is displayed
    expect(screen.getByText(/sign-in failed/i)).toBeInTheDocument();
  });
});
