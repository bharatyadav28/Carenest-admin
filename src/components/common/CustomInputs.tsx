import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  maxChars?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export const CustomTextArea = ({
  maxChars,
  text,
  setText,
  className,
  ...props
}: Props) => {
  const classes = `resize-none border-gray-400  ${className}`;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxChars && event.target.value.length > maxChars) {
      return;
    }
    setText(event.target.value);
  };

  return (
    <>
      <Textarea
        id="message"
        placeholder="Type your description here..."
        value={text}
        onChange={handleChange}
        className={classes}
        {...props}
      />
      <p
        className={`text-sm ms-1 ${
          text.length === maxChars ? "text-red-500" : "text-gray-500"
        }`}
      >
        {maxChars && maxChars - text.length + " characters remaining"}
      </p>
    </>
  );
};

// Normal input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxChars?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export const CustomInput = ({
  maxChars,
  text,
  setText,
  className,
  ...props
}: InputProps) => {
  const classes = `resize-none border-gray-400 py-5  ${className}`;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (maxChars && event.target.value?.length > maxChars) {
      return;
    }
    setText(event.target.value);
  };

  return (
    <>
      <Input
        id="message"
        placeholder="Type your caption here..."
        value={text}
        onChange={handleChange}
        className={classes}
        {...props}
      />
      <p
        className={`text-sm ms-1 ${
          text?.length === maxChars ? "text-red-500" : "text-gray-500"
        }`}
      >
        {maxChars && maxChars - text.length + " characters remaining"}
      </p>
    </>
  );
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDeleting?: boolean;
}

export const CustomButton = ({
  children,
  onClick,
  className,
  ...props
}: BtnProps) => {
  const classes = `w-max ${className}  transition hover:cursor-pointer`;

  return (
    <Button className={classes} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};
