import axios from 'axios';

export const getCSRFToken = async () => {
  try {
    const response = await axios.get('http://localhost:8000/csrf/', { withCredentials: true });
    const csrfToken = response.data.csrfToken;
    console.log(`Fetched CSRF token: ${csrfToken}`);  // Log the fetched CSRF token
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};
