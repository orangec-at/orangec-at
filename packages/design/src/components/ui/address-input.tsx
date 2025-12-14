import React from "react";
import { Input } from "@orangec-at/design/components/ui/input";
import { Button } from "@orangec-at/design/components/ui/button";
import { FormField } from "@orangec-at/design/components/ui/form-field";

interface AddressInputProps {
  label?: string;
  required?: boolean;
  zipCode: string;
  address: string;
  detailAddress: string;
  onZipCodeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDetailAddressChange: (value: string) => void;
  onAddressSearch?: () => void;
  className?: string;
}

export function AddressInput({
  label = "주소",
  required = false,
  zipCode,
  address,
  detailAddress,
  onZipCodeChange,
  onAddressChange,
  onDetailAddressChange,
  onAddressSearch,
  className,
}: AddressInputProps) {
  return (
    <FormField
      label={label}
      required={required}
      className={`col-span-2 ${className || ""}`}
    >
      <div className="flex flex-col gap-(--gap-5)">
        {/* 데스크톱: 우편번호 | 주소 | 주소찾기 / 모바일: 우편번호 */}
        <div className="flex flex-col sm:flex-row gap-(--gap-3)">
          <Input
            type="text"
            placeholder="우편번호"
            className="w-[240px] shrink-0"
            value={zipCode}
            size="small"
            onChange={(e) => onZipCodeChange(e.target.value)}
          />

          {/* 모바일에서만 보이는 주소 + 버튼 행 */}
          <div className="flex gap-(--gap-3) sm:hidden">
            <Input
              type="text"
              placeholder="주소"
              value={address}
              size="small"
              className="flex-1"
              onChange={(e) => onAddressChange(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onAddressSearch}
              className="shrink-0"
            >
              주소찾기
            </Button>
          </div>

          {/* 데스크톱에서만 보이는 주소 + 버튼 */}
          <div className="hidden sm:flex gap-(--gap-3) flex-1">
            <Input
              type="text"
              placeholder="주소"
              value={address}
              size="small"
              className="flex-1"
              onChange={(e) => onAddressChange(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={onAddressSearch}
              className="shrink-0"
            >
              주소찾기
            </Button>
          </div>
        </div>

        {/* 데스크톱: 공백 | 상세주소 / 모바일: 상세주소 */}
        <div className="flex gap-(--gap-3)">
          <div className="hidden sm:block w-[240px] shrink-0" />
          <Input
            type="text"
            placeholder="상세주소"
            value={detailAddress}
            size="small"
            className="flex-1"
            onChange={(e) => onDetailAddressChange(e.target.value)}
          />
        </div>
      </div>
    </FormField>
  );
}
