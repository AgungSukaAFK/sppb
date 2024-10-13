import { ReactNode } from "react";
import s from "./index.module.scss";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "primary" | "submit" | "delete" | "unfocused";
};

// Contoh penggunaan cta
// const cta: CtaType = [
//   {
//     text: "Anjay",
//     onClick: () => {},
//     type: "primary",
//   },
// ];

export default function Button({
  children,
  className,
  onClick,
  disabled,
  type = "primary",
}: ButtonProps) {
  function applyClass(typeButton: ButtonProps["type"], disabled?: boolean) {
    if (typeButton === "primary") {
      return disabled ? s.button__primary__disabled : s.button__primary;
    } else if (typeButton === "submit") {
      return disabled ? s.button__submit__disabled : s.button__submit;
    } else if (typeButton === "delete") {
      return disabled ? s.button__danger__disabled : s.button__danger;
    } else if (typeButton === "unfocused") {
      return disabled ? s.button__unfocused__disabled : s.button__unfocused;
    }
  }

  return (
    <button
      className={`${applyClass(type)} ${
        disabled && applyClass(type, true)
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
