import React, { useState, useRef } from "react";
import { debounce } from "lodash";
import Editor from "@monaco-editor/react";
import { useQuestionContext } from "../../contexts/QuestionContext";
import * as monacoEditor from "monaco-editor"; // Import Monaco types
import { EditorProps } from "../../types";
import { Box, Typography } from "@mui/material"; // Import MUI components

const MyEditor: React.FC<EditorProps> = ({
  language = "javascript",
  code = "",
  setCode = () => {},
}) => {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const { updateProgress } = useQuestionContext();
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
        // Handle abort error if needed
      } else {
        console.error("Error loading or defining theme:", error);
        setThemeError(
          "Error loading or defining theme. Please check the theme JSON format."
        );
      }
    }
  };

  const handleEditorWillMount = (monacoInstance: typeof monacoEditor) => {
    // This is called before the editor is mounted
    // loadTheme(monacoInstance);
  };

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    editorRef.current = editor; // Store editor instance in ref
    monaco.editor.setTheme("myTheme");
  };

  const handleCodeChange = debounce((newCode: string) => {
    console.log("Code change detected:", newCode);  // Log the new code

    setCode(newCode || "");

    // Get the question ID from the URL or props
    const questionId = window.location.pathname.split("/").pop();
    console.log("Question ID:", questionId); // Log the question ID

    if (questionId) {
      console.log("Calling updateProgress with code:", newCode); // Log before calling updateProgress
      updateProgress(questionId, newCode, [], []); // Empty test result arrays, as this is for saving progress
    }
  }, 500);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      {themeError && (
        <Typography color="error">{themeError}</Typography>
      )}
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(newValue: string | undefined) =>
          handleCodeChange(newValue || "")
        }
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
    </Box>
  );
};

export default MyEditor;

// colors: {
//   'editor.background': '#fafbfc', // Light background
//   'editor.foreground': '#24292e', // Dark gray text
//   'editor.lineHighlightBackground': '#f6f8fa', // Slightly darker line highlight
//   'editorCursor.foreground': '#24292e', // Dark cursor
//   'editorLineNumber.foreground': '#959da5', // Lighter gray line numbers
//   'editor.selectionBackground': '#c8e1ff', // Light blue selection
//   'editor.inactiveSelectionBackground': '#f0f3f7', // Very light gray inactive selection
// },
