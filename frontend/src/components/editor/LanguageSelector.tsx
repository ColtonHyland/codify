import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LanguageSelectorProps } from '../../types';

const languages = ['javascript', 'sql', 'cpp', 'python', 'java'];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value as string)}
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
