import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import SignOut from '../components/auth/SignOut';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SignOut Component', () => {
  test('renders SignOut button', () => {
    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  test('handles sign out', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/accounts/logout/',
        {},
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('displays error message on failed sign out', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Failed to sign out'));

    render(
      <MemoryRouter>
        <SignOut />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/accounts/logout/',
        {},
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to sign out');
    });
  });
});
