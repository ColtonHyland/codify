import React from 'react';

interface DropdownSelectorProps {
  onDifficultyChange: (difficulty: string) => void;
  onCategoryChange: (category: string) => void;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({ onDifficultyChange, onCategoryChange }) => {
  return (
    <div>
      <label>
        Difficulty:
        <select onChange={(e) => onDifficultyChange(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </label>
      <label>
        Category:
        <select onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="SQL">SQL</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
        </select>
      </label>
    </div>
  );
};
