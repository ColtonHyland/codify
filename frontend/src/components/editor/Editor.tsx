import React from "react";
import MonacoEditor from "react-monaco-editor";
import { EditorProps } from "../../types";

const Editor: React.FC<EditorProps> = ({
  language = "javascript",
  code = "",
  setCode = () => {},
}) => {
  return (
    <MonacoEditor
      width="100%"
      height="600px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(newValue) => setCode(newValue)}
    />
  );
};

export default Editor;
