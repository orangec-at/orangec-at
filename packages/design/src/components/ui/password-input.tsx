"use client";

import * as React from "react";
import { Input, type InputProps } from "@orangec-at/design/components/ui/input";
import VisibilityIcon from "@orangec-at/design/components/svgs/system_icon/visibility.svg";
import VisibilityOffIcon from "@orangec-at/design/components/svgs/system_icon/visibility_off.svg";

export interface PasswordInputProps extends Omit<InputProps, "type" | "icon"> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        icon={
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="cursor-pointer hover:opacity-70 transition-opacity focus-ring"
            tabIndex={-1}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <VisibilityOffIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <VisibilityIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
