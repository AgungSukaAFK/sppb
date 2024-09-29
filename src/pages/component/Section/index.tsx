import { ReactNode } from "react";
import Button from "../Button";
import s from "./index.module.scss";

type SectionProps = {
  children: ReactNode;
  cta?: CtaType;
  className?: string;
  header?: string;
};

export type CtaType = [
  {
    type?: "primary" | "submit" | "delete";
    text: string;
    onClick?: () => void;
    disabled?: boolean;
  }
];

export default function Section({
  children,
  className,
  header = "Section header",
  cta,
}: SectionProps) {
  return (
    <section className={`${s.section} ${className}`}>
      <div className={s.section__header}>{header}</div>
      <hr />
      <div className={s.section__body}>{children}</div>
      <div className={s.section__cta}>
        {cta?.map((item, index) => (
          <Button
            key={index}
            type={item.type}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.text}
          </Button>
        ))}
      </div>
    </section>
  );
}
