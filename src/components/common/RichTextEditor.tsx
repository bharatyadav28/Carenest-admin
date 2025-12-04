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
          readonly: readOnly,
          height: 380,
          style: {
            background: "#2d2d2d",
            color: "#ffffff",
          },
          placeholder: placeholder || "Start typing...",

          // CLEAN PASTE — remove background/formatting
          defaultActionOnPaste: "insert_clear_html",
          askBeforePasteHTML: false,
          askBeforePasteFromWord: false,

          // remove background color/styles from content
          cleanHTML: {
            fillEmptyParagraph: false,
            replaceNBSP: true,
          },
        }}
      />
    </div>
  );
};

export default TextEditor;
