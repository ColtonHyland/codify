import React, { useState, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor"; // Import Monaco types
import { EditorProps } from "../../types";

const MyEditor: React.FC<EditorProps> = ({
  language = "javascript",
  code = "",
  setCode = () => {},
}) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const [themeError, setThemeError] = useState<string | null>(null);

  const loadTheme = async (monacoInstance: typeof monacoEditor) => {
    try {
      const response = await fetch("/custom-theme.json");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      monacoInstance.editor.defineTheme("myTheme", data);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
      } else {
        console.error("Error loading or defining theme:", error);
        setThemeError("Error loading or defining theme. Please check the theme JSON format.");
      }
    }
  };

  const handleEditorWillMount = (monacoInstance: typeof monacoEditor) => {
    // This is called before the editor is mounted
    loadTheme(monacoInstance);
  };

  const handleEditorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    editorRef.current = editor; // Store editor instance in ref
    monaco.editor.setTheme("myTheme");
  };

  return (
    <div>
      {themeError && <div style={{ color: "red" }}>{themeError}</div>}
      <Editor
        height="600px"
        language={language}
        value={code}
        onChange={(newValue: string | undefined) => setCode(newValue || "")}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default MyEditor;

// function uniquePaths(m, n) {
//   const dp = Array(m).fill().map(() => Array(n).fill(1));

//   for (let i = 1; i < m; i++) {
//     for (let j = 1; j < n; j++) {
//       dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
//     }
//   }

//   return dp[m - 1][n - 1];
// }

// colors: {
//   'editor.background': '#fafbfc', // Light background
//   'editor.foreground': '#24292e', // Dark gray text
//   'editor.lineHighlightBackground': '#f6f8fa', // Slightly darker line highlight
//   'editorCursor.foreground': '#24292e', // Dark cursor
//   'editorLineNumber.foreground': '#959da5', // Lighter gray line numbers
//   'editor.selectionBackground': '#c8e1ff', // Light blue selection
//   'editor.inactiveSelectionBackground': '#f0f3f7', // Very light gray inactive selection
// },
