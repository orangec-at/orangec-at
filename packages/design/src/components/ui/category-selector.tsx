import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  enabled?: boolean;
  className?: string;
  onSelectionChange: (selected: string[]) => void;
  onEnabledChange?: (enabled: boolean) => void;
}

export function CategorySelector({
  title,
  options,
  selectedOptions,
  enabled = true,
  className,
  onSelectionChange,
  onEnabledChange,
}: CategorySelectorProps) {
  const handleOptionToggle = (option: string) => {
    if (!enabled) return;

    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    onSelectionChange(newSelected);
  };

  const handleChipClick = () => {
    if (onEnabledChange) {
      onEnabledChange(!enabled);
    }
  };

  return (
    <div
      className={cn(
        "py-(--padding-6) px-(--padding-8) gap-(--gap-5)",
        "flex flex-col border-r flex-1",
        className
      )}
    >
      <Chip
        className={cn("min-w-0 w-full", "mb-[10px]")}
        state={enabled ? "selected" : "default"}
        onClick={handleChipClick}
      >
        {title}
      </Chip>
      <div className="flex flex-col gap-(--gap-6) w-full">
        {options.map((option, index) => (
          <div className="flex flex-row items-center w-full" key={index}>
            <Checkbox
              className="size-[20px] border"
              disabled={!enabled}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => handleOptionToggle(option)}
            />
            <Label
              className={cn(
                "ml-(--gap-3)",
                !enabled && "text-(--krds-gray-40)"
              )}
              variant="m-400"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
