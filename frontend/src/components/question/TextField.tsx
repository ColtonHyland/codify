import React from 'react';

interface JSONTextFieldProps {
  jsonText: string;
}

export const JSONTextField: React.FC<JSONTextFieldProps> = ({ jsonText }) => {
  return (
    <div>
      <h2>Generated Question</h2>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid #ccc', padding: '10px' }}>
        {jsonText}
      </pre>
    </div>
  );
};
