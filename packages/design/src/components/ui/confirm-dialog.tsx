import { Button } from "@/components/ui/button";
import { bodyVariants } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmDialogProps) {
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
          <DialogTitle className="py-(--padding-10)">
            <span className={bodyVariants({ variant: "m-400" })}>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-3 pt-(--gap-5)">
          <Button
            onClick={handleCancel}
            variant="tertiary"
            size="medium"
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} size="medium" className="flex-1">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
