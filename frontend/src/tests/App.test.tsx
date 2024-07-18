import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Sign In heading', () => {
  render(<App />);
  
  // Get all elements with the text "Sign In"
  const headingElements = screen.getAllByText(/sign in/i);
  
  // Check if at least one of them is a heading
  const headingElement = headingElements.find(el => el.tagName.toLowerCase() === 'h1');
  expect(headingElement).toBeInTheDocument();
});
