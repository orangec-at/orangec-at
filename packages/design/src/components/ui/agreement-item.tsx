import { Button } from "@orangec-at/design/components/ui/button";
import { Checkbox } from "@orangec-at/design/components/ui/checkbox";
import { bodyVariants } from "@orangec-at/design/components/ui/typography";
import { cn } from "@orangec-at/design/lib/utils";

interface AgreementItemProps {
  id: string;
  label: string;
  required?: boolean;
  checked: boolean;
  isMobile?: boolean;
  onCheckedChange: (checked: boolean) => void;
  onViewContent?: () => void;
}

export function AgreementItem({
  label,
  required = false,
  checked,
  isMobile = false,
  onCheckedChange,
  onViewContent,
}: AgreementItemProps) {
  const popupTitle = isMobile ? "보기" : "내용 보기";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCheckedChange(!checked);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-3 cursor-pointer focus-ring rounded-md"
        onClick={() => onCheckedChange(!checked)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={checked}
        aria-label={`${label} ${required ? "(필수)" : "(선택)"}`}
      >
        <Checkbox
          className="size-[24px]"
          checked={checked}
          onCheckedChange={onCheckedChange}
          select="reversal"
          tabIndex={-1}
        />
        <span
          className={cn(
            isMobile
              ? bodyVariants({ variant: "m-400" })
              : bodyVariants({ variant: "l-400" })
          )}
        >
          {label}{" "}
          {required ? (
            <span className="text-(--krds-danger-60)">(필수)</span>
          ) : (
            <span className="text-(--krds-danger-60)">(선택)</span>
          )}
        </span>
      </div>
      {onViewContent && (
        <Button
          variant="link"
          onClick={onViewContent}
          title={`${label} 내용 보기`}
        >
          {popupTitle}
        </Button>
      )}
    </div>
  );
}
