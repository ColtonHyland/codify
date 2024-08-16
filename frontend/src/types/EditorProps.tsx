export interface EditorProps {
  language: string;
  code: string;
  setCode: (code: string) => void;
}
