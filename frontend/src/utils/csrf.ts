import axios from 'axios';

export const getCSRFToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get<{ csrfToken: string }>('http://localhost:8000/csrf/');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};
