"use client";
import { useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import Button from "@/pages/component/Button";
import { api } from "@/lib/axios/services";
import { authServices } from "@/services/auth";
import { useLoading } from "@/hooks/useLoading";

export default function LoginView() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [alert, setAlert] = useState("");
  const useridRef = useRef(null);
  const passRef = useRef(null);
  const { setLoading } = useLoading();
  useEffect(() => {
    if (userId.length > 0 && password.length > 4) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [userId, password]);

  async function login() {
    try {
      setLoading(true);
      const res = await authServices.loginUser({ userid: userId, password });
      if (res.success) {
        console.log(res.status);
        if (res.status === 200) {
          window.location.href = "/dashboard";
        } else {
          setAlert("Fail: " + res.data.message);
        }
      } else {
        console.log(res);
        setAlert("Fail");
      }
    } catch (error) {
      setAlert("Something wrong from server");
    } finally {
      setLoading(false);
    }
  }

  // Alert
  useEffect(() => {
    if (alert) {
      setDisabled(true);
      setTimeout(() => {
        setDisabled(false);
        setAlert("");
      }, 5000);
    }
  }, [alert]);
  return (
    <div className={s.c}>
      <form className={s.c__f}>
        <div className={s.c__f__logo}>Logo</div>
        <h3 className={s.c__f__header}>Masuk ke akun</h3>
        <div className={s.c__f__input}>
          <label htmlFor="userid">User ID</label>
          <input
            type="text"
            name="userId"
            id="userid"
            ref={useridRef}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className={s.c__f__input}>
          <label htmlFor="password">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            id="password"
            ref={passRef}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={
              passwordVisible ? "bx bx-lock-open-alt" : "bx bx-lock-alt"
            }
            onClick={() => setPasswordVisible(!passwordVisible)}
          ></i>
        </div>
        <Button onClick={login} disabled={disabled} className={s.c__f__btn}>
          Masuk
        </Button>
        {alert && <div className={s.alert}>{alert}</div>}
      </form>
    </div>
  );
}
