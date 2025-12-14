"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@orangec-at/design/lib/utils";
import { Button } from "@orangec-at/design/components/ui/button";
import { Calendar as CalendarComponent } from "@orangec-at/design/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@orangec-at/design/components/ui/popover";
import { Label } from "@orangec-at/design/components/ui/typography";

interface DatePickerProps {
  placeholder?: string;
  className?: string;
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
}

interface DateRangePickerProps {
  placeholder?: string;
  className?: string;
  dateRange?: DateRange;
  onSelect?: (dateRange: DateRange | undefined) => void;
}

interface CalendarProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

const Calendar = ({ date, onSelect, disabled }: CalendarProps) => (
  <CalendarComponent
    captionLayout="dropdown"
    mode="single"
    selected={date}
    onSelect={onSelect}
    disabled={disabled}
    locale={ko}
    classNames={
      {
        // dropdowns: 'w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5 flex-row-reverse'
      }
    }
  />
);

export function DatePicker({
  placeholder = "YYYY.MM.DD",
  className,
  date,
  onSelect,
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            "flex-1 justify-between text-left !px-(--padding-6)",
            "min-w-[180px] max-w-[240px]",
            !date && "text-(--gray-40)",
            disabled && "border-(--gray-20) bg-(--gray-10) text-(--gray-40)",
            className
          )}
        >
          <Label variant="s-400">
            {date instanceof Date
              ? format(date, "yyyy.MM.dd")
              : typeof date === "string"
              ? date
              : placeholder}
          </Label>
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar date={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}

export function DateRangePicker({
  placeholder = "YYYY.MM.DD",
  className,
  dateRange,
  onSelect,
}: DateRangePickerProps) {
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [isToOpen, setIsToOpen] = React.useState(false);

  const handleFromSelect = (date: Date | undefined) => {
    onSelect?.({ from: date, to: dateRange?.to });
    setIsFromOpen(false);
  };

  const handleToSelect = (date: Date | undefined) => {
    onSelect?.({ from: dateRange?.from, to: date });
    setIsToOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-(--gap-5)", className)}>
      {/* From Date Picker */}
      <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-between text-left font-normal !px-(--padding-6)",
              "min-w-[180px] max-w-[240px]",
              !dateRange?.from && "text-(--gray-40)"
            )}
          >
            <Label variant="s-400">
              {dateRange?.from
                ? format(dateRange.from, "yyyy.MM.dd")
                : placeholder}
            </Label>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar date={dateRange?.from} onSelect={handleFromSelect} />
        </PopoverContent>
      </Popover>

      {/* Separator */}
      <span className="text-muted-foreground">~</span>

      {/* To Date Picker */}
      <Popover open={isToOpen} onOpenChange={setIsToOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal !px-(--padding-6) ",
              "min-w-[180px] max-w-[240px]",
              !dateRange?.to && "text-(--gray-40)"
            )}
          >
            <Label variant="s-400">
              {dateRange?.to ? format(dateRange.to, "yyyy.MM.dd") : placeholder}
            </Label>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            date={dateRange?.to}
            onSelect={handleToSelect}
            disabled={(date) =>
              dateRange?.from ? date < dateRange.from : false
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
