// TextEditor.tsx
import JoditEditor from "jodit-react";

interface Props {
  value: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
}

const TextEditor = ({ value, onChange, readOnly = false, className, placeholder }: Props) => {
  return (
    <div className={className}>
      <JoditEditor
        value={value}
        onBlur={(newContent) => onChange(newContent)}
        config={{
          readonly: readOnly, // This controls the read-only state
          height: 380,
          style: {
            background: "#2d2d2d",
            color: "#ffffff",
          },
          placeholder: placeholder || "Start typing...",
        }}
      />
    </div>
  );
};

export default TextEditor;