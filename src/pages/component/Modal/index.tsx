import React from "react";
import s from "./index.module.scss";
import Button from "../Button";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  type?: "default";
  close: () => void;
  submit: () => void;
}

function Modal({
  children,
  title = "Modal title",
  type = "default",
  submit,
  close,
}: ModalProps) {
  console.log(type);
  return (
    <div className={s.m}>
      <div className={s.m__c}>
        <header>{title}</header>
        {children}
        <footer>
          <Button onClick={() => close()}>Kembali</Button>
          <Button type="submit" onClick={() => submit()}>
            Submit
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default Modal;
