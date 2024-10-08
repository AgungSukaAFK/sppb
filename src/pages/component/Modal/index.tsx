import React from "react";
import s from "./index.module.scss";
import Button from "../Button";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  type?: "prompt" | "information";
  close: () => void;
  submit?: () => void;
}

function Modal({
  children,
  title = "Modal title",
  type = "prompt",
  submit = () => {},
  close,
}: ModalProps) {
  if (type === "prompt") {
    return (
      <div className={s.m}>
        <div className={`${s.m__c}`}>
          <header>{title}</header>
          <div className={s.m__c__w}>{children}</div>
          <footer>
            <Button onClick={() => close()}>Kembali</Button>
            <Button type="submit" onClick={() => submit()}>
              Submit
            </Button>
          </footer>
        </div>
      </div>
    );
  } else if (type === "information") {
    return (
      <div className={s.m}>
        <div className={`${s.m__c}`}>
          <header>{title}</header>
          <div className={s.m__c__w}>{children}</div>
          <footer>
            <Button onClick={() => close()}>Kembali</Button>
          </footer>
        </div>
      </div>
    );
  }
}

export default Modal;
