import { Button } from "@/components/ui/button";
import { bodyVariants } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface AlertProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  onConfirm?: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string;
  showCancel?: boolean;
}

export default function Alert({
  open,
  onOpenChange,
  title,
  onConfirm,
  confirmText = "확인",
  onCancel,
  cancelText = "취소",
  showCancel = false,
}: AlertProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[400px] p-(--padding-8)"
      >
        <DialogHeader className="flex items-center">
          <DialogTitle className="py-(--padding-10) ">
            <span className={bodyVariants({ variant: "m-400" })}>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter
          className={`flex pt-(--gap-5) ${showCancel ? "gap-(--gap-3)" : ""}`}
        >
          {showCancel && (
            <Button
              onClick={handleCancel}
              size="medium"
              variant="secondary"
              className="flex-1"
            >
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm} size="medium" className="flex-1">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
