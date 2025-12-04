import { CiEdit as EditIcon } from "react-icons/ci";
import { MdDelete as DeleteIcon } from "react-icons/md";
import { FiPlus as PlusIcon } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const classes = `resize-none border-gray-400 py-5   ${className}`;

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

// Select Input with different menu item and its corresponding value
interface SelectProps2 {
  menu: { value: string; key: string }[];
  value: string;
  onChange:
    | React.Dispatch<React.SetStateAction<string>>
    | ((val: string) => void);
  className?: string;
  placeholder?: string;
}
export const CustomSelectSeperate = ({
  menu,
  value,
  onChange,
  className,
  placeholder,
  ...props
}: SelectProps2) => {
  const classes = `py-5 border-gray-400 ${className}`;
  return (
    <>
      <Select onValueChange={onChange} value={value} {...props}>
        <SelectTrigger
          className={`${classes} [&>svg]:transition-transform [&>svg]:duration-200 [&[data-state=open]>svg]:rotate-180 !bg-inherit`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {menu?.map((item) => {
            return (
              <SelectItem key={item.key} value={item.value}>
                {item.key}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
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

// Mutation buttons
export const UpdateButton = ({ onClick, className, ...props }: BtnProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`green-button ${className} hover:cursor-pointer`}
      onClick={onClick}
      {...props}
    >
      <EditIcon size={20} />
    </Button>
  );
};

export const DeleteButton = ({
  children,
  onClick,
  className,
  isDeleting,
  ...props
}: BtnProps) => {
  return (
    <Button
      variant="destructive"
      size="icon"
      className={` ${className} hover:cursor-pointer`}
      onClick={onClick}
      disabled={isDeleting}
      {...props}
    >
      {isDeleting ? <LoadingSpinner /> : <DeleteIcon size={20} />}
    </Button>
  );
};

export const ViewButton = ({ onClick, className, ...props }: BtnProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`!bg-[var(--golden)] !hover:bg-[var(--dark-golden)] ${className} transition hover:cursor-pointer`}
      onClick={onClick}
      {...props}
    >
      <FaEye size={20} />
    </Button>
  );
};

export const AssignButton = ({ onClick, className, ...props }: BtnProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`green-button ${className} hover:cursor-pointer`}
      onClick={onClick}
      {...props}
    >
      <PlusIcon size={20} />
    </Button>
  );
};

export const AddButton = ({
  onClick,
  className,
  tooltipContent,
  ...props
}: BtnProps & { tooltipContent?: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          size={"icon"}
          variant="outline"
          className={`size-5 rounded-full hover:cursor-pointer ${className}`}
          onClick={onClick}
          {...props}
        >
          <PlusIcon size={20} />
        </Button>
      </TooltipTrigger>
      {tooltipContent && <TooltipContent>{tooltipContent}</TooltipContent>}
    </Tooltip>
  );
};
