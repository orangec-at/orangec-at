import { Body } from "@orangec-at/design/components/ui/typography";
import { cn } from "@orangec-at/design/lib/utils";

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function CardSection({
  title,
  children,
  className,
  headerClassName,
  contentClassName,
}: CardSectionProps) {
  return (
    <div className={cn("flex flex-col gap-(--gap-6)", className)}>
      {/* 타이틀을 카드 외부에 표시 */}
      <Body variant={"m-700"} className={cn("", headerClassName)}>
        {title}
      </Body>

      {/* 헤더 없는 카드 (flex 레이아웃 유지) */}
      <div
        className={cn(
          "border rounded-[24px] p-(--padding-10) bg-white flex",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
