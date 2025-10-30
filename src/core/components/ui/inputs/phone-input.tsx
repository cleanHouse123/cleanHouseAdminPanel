import * as React from "react";
import { Input, type InputProps } from "./input";

interface PhoneInputProps
  extends Omit<InputProps, "type" | "onChange" | "inputMode" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function toCleanRussianPhone(value: string): string {
  const digitsOnly = extractDigits(value);
  if (!digitsOnly) return "";

  let normalized = digitsOnly;
  if (normalized.startsWith("8")) normalized = "7" + normalized.slice(1);
  if (!normalized.startsWith("7")) normalized = "7" + normalized;

  const full = "+" + normalized.slice(0, 11);
  return full;
}

function formatRussianPhone(value: string): string {
  const digitsOnly = extractDigits(value);
  if (!digitsOnly) return "";

  let normalized = digitsOnly;
  if (normalized.startsWith("8")) normalized = "7" + normalized.slice(1);
  if (!normalized.startsWith("7")) normalized = "7" + normalized;

  const rest = normalized.slice(1);
  const p1 = rest.slice(0, 3);
  const p2 = rest.slice(3, 6);
  const p3 = rest.slice(6, 8);
  const p4 = rest.slice(8, 10);

  let result = "+7";
  if (p1) {
    result += ` (${p1}`;
    // Закрываем скобку только когда начинаем следующий блок (после 3 цифр)
    if (rest.length > 3) result += ")";
  }
  if (p2) result += ` ${p2}`;
  if (p3) result += `-${p3}`;
  if (p4) result += `-${p4}`;
  return result.trim();
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, placeholder, ...rest }, ref) => {
    const formattedValue = React.useMemo(() => {
      const clean = toCleanRussianPhone(value ?? "");
      if (!clean || clean === "+7") return "";
      return formatRussianPhone(clean);
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const clean = toCleanRussianPhone(e.target.value);
      onChange?.(clean);
    }

    return (
      <Input
        ref={ref as React.RefObject<HTMLInputElement>}
        type="tel"
        inputMode="tel"
        className={className}
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder ?? "+7 (___) ___-__-__"}
        {...rest}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export default PhoneInput;


