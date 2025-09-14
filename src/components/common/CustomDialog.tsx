import { Trash as DeleteIcon } from "lucide-react";

import { CustomButton } from "./CustomInputs";
import { LoadingSpinner } from "../LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  handleOpen: () => void;
  children: React.ReactNode;
  className?: string;
}
export function CustomDialog({ open, handleOpen, children, className }: Props) {
  let classes =
    "max-w-full w-[10rem] min-h-[10rem] !bg-[#000] !rounded-3xl overflow-y-auto pt-4 pb-0 ";
  if (className) {
    classes += " " + className;
  }
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogDescription className="hidden"></DialogDescription>

      <DialogContent className={classes}>
        <div className="flex flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteProps {
  openDialog: boolean;
  handleOpenDialog: () => void;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  Icon?: React.ElementType;
  isDeleting?: boolean;
}
export function DeleteDialog({
  openDialog,
  handleOpenDialog,
  title,
  description,
  onCancel,
  onConfirm,
  Icon,
  isDeleting = false,
}: DeleteProps) {
  return (
    <CustomDialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      className="w-max !p-0 overflow-visible "
    >
      <div className="relative z-[1000]">
        {/* Icon */}
        <div className="w-[115px] h-[70px]  border-black/65 border-[8px] rounded-b-full absolute  left-1/2 -translate-x-1/2 top-[-0.62rem]"></div>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[100px] h-[100px] border-[8px] flex justify-center items-center bg-[#1B1B1B] rounded-full">
          {Icon ? (
            <Icon className="text-white" size={30} />
          ) : (
            <DeleteIcon className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="bg-[#fff] p-4 pt-20 min-w-[20rem] rounded-3xl flex flex-col justify-center items-center gap-2 text-black">
          <div className="text-center font-bold text-2xl">{title} </div>
          <div className="text-center text-[0.9rem]">{description}</div>

          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <CustomButton
              className="border-none py-6 !w-full min-w-[10rem] bg-[#f1f4f6] hover:bg-[#f1f4f6] text-black !hover:opacity-50 rounded-lg "
              onClick={onCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className="py-6 !w-full min-w-[10rem] bg-[#1B1B1B] text-[#fff] hover:bg-[#1B1B1B] hover:opacity-80 rounded-lg "
              onClick={onConfirm}
            >
              {isDeleting ? <LoadingSpinner /> : "Confirm"}
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}
