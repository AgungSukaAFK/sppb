"use client";
import Button from "@/pages/component/Button";
import Section, { CtaType } from "@/pages/component/Section";
import { User } from "@/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import s from "./index.module.scss";
import { useLoading } from "@/hooks/useLoading";
import { userServices } from "@/services/user";
import { authServices } from "@/services/auth";

type Props = {
  user: User;
};

export default function ProfilAkunView({ user }: Props) {
  const { showLoading, closeLoading } = useLoading();
  const [disabledCta, setDisabledCta] = useState<boolean>(false);
  // CTA Section
  const cta: CtaType = [
    {
      type: "primary",
      text: "Save",
      onClick: onSave,
      disabled: disabledCta,
    },
  ];

  // Profile navigation
  type states = "nama" | "email" | "password" | "phone";
  type buttonTypes = "primary" | "submit" | "delete" | "unfocused" | undefined;
  const [profileState, setProfileState] = useState<states>("nama");

  function determineType(state: states): buttonTypes {
    if (state === profileState) {
      return "primary";
    } else {
      return "unfocused";
    }
  }

  // Profile body actions
  function onSave() {
    switch (profileState) {
      case "nama":
        saveNama();
        break;
      case "email":
        saveEmail();
        break;
      case "password":
        savePassword();
        break;
      case "phone":
        savePhone();
        break;
    }
  }
  const [alertMessage, setAlertMessage] = useState<string>("");

  // body Nama
  const [nama, setNama] = useState<string>(user?.nama as string);
  async function saveNama() {
    if (user?.nama === nama) {
      setAlertMessage("Tidak ada perubahan");
    } else if (nama === "") {
      setAlertMessage("Input tidak boleh kosong");
    } else {
      try {
        showLoading();
        setDisabledCta(true);
        const res = await userServices.editNama(nama);
        if (res.status === 200) {
          setAlertMessage("Nama berhasil diupdate");
          user.nama = nama;
        } else {
          setAlertMessage("Gagal update");
        }
      } catch (err) {
        console.log(err);
        setAlertMessage(`Error: ${err}`);
      } finally {
        closeLoading();
        setDisabledCta(false);
      }
    }
  }

  // body Email
  const [email, setEmail] = useState<string>(user?.email as string);
  async function saveEmail() {
    if (user?.email === email) {
      setAlertMessage("Tidak ada perubahan");
    } else if (email === "") {
      setAlertMessage("Input tidak boleh kosong");
    } else {
      try {
        showLoading();
        setDisabledCta(true);
        const res = await userServices.editEmail(email);
        if (res.status === 200) {
          setAlertMessage("Email berhasil diupdate");
          user.email = email;
        } else {
          setAlertMessage("Gagal update");
        }
      } catch (err) {
        console.log(err);
        setAlertMessage(`Error: ${err}`);
      } finally {
        closeLoading();
        setDisabledCta(false);
      }
    }
  }

  // body Password
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [verifyPass, setVerifyPass] = useState<string>("");
  const [putOverlay, setPutOverlay] = useState<boolean>(false);
  function adaHurufBesarKecil(str: string) {
    const hasUpperCase = /[A-Z]/.test(str);
    const hasLowerCase = /[a-z]/.test(str);

    return hasUpperCase && hasLowerCase;
  }
  async function savePassword() {
    if (oldPass === "" || newPass === "" || verifyPass === "") {
      setAlertMessage("Input tidak boleh kosong");
    } else if (newPass.length < 5) {
      setAlertMessage("Password baru minimal 5 karakter");
    } else if (newPass.length >= 50) {
      setAlertMessage("Password baru maksimal 50 karakter");
    } else if (verifyPass.length < 5) {
      setAlertMessage("Konfirmasi password baru minimal 5 karakter");
    } else if (verifyPass.length >= 50) {
      setAlertMessage("Konfirmasi password baru maksimal 50 karakter");
    } else if (!adaHurufBesarKecil(newPass)) {
      setAlertMessage(
        "Password baru harus mengandung huruf kecil dan huruf besar"
      );
    } else if (oldPass === newPass && newPass === verifyPass) {
      setAlertMessage("Input password lama dan baru tidak boleh sama");
    } else if (newPass !== verifyPass) {
      setAlertMessage("Konfirmasi password baru tidak sama");
    } else {
      try {
        showLoading();
        setDisabledCta(true);
        const res = await userServices.editPassword(oldPass, newPass);
        if (res.status === 200) {
          setOldPass("");
          setNewPass("");
          setVerifyPass("");

          let countDown = 8;

          const interval = setInterval(async () => {
            setPutOverlay(true);
            setAlertMessage(
              `Password berhasil diubah, akan diarahkan untuk login ulang dalam ${countDown} detik`
            );
            countDown -= 1;

            if (countDown <= 0) {
              clearInterval(interval);
              try {
                showLoading();
                const logoutRes = await authServices.logoutUser();
                if (logoutRes) {
                  window.location.href = "/auth";
                } else {
                  console.log("Error logout");
                }
              } catch (error) {
                console.log(error);
              } finally {
                closeLoading();
                setPutOverlay(false);
              }
            }
          }, 1000);
        } else {
          setAlertMessage(`Gagal update password: ${res.data.message}`);
        }
      } catch (err) {
        console.log(err);
        setAlertMessage(`Error: ${err}`);
      } finally {
        closeLoading();
        setDisabledCta(false);
      }
    }
  }

  // body Phone
  const [phone, setPhone] = useState<string>(user?.phone as string);
  async function savePhone() {
    if (user?.phone === phone) {
      setAlertMessage("Tidak ada perubahan");
    } else if (phone === "") {
      setAlertMessage("Input tidak boleh kosong");
    } else {
      try {
        showLoading();
        setDisabledCta(true);
        const res = await userServices.editPhone(phone);
        if (res.status === 200) {
          setAlertMessage("Nomor telepon berhasil diupdate");
          user.phone = phone;
        } else {
          setAlertMessage("Gagal update");
        }
      } catch (err) {
        console.log(err);
        setAlertMessage(`Error: ${err}`);
      } finally {
        closeLoading();
        setDisabledCta(false);
      }
    }
  }

  // RENDER BODY
  const renderBody = useMemo(() => {
    switch (profileState) {
      case "nama":
        return <NamaBody user={user} setNama={setNama} />;
      case "email":
        return <EmailBody user={user} setEmail={setEmail} />;
      case "password":
        return (
          <PasswordBody
            setNewPass={setNewPass}
            setOldPass={setOldPass}
            setVerifyPass={setVerifyPass}
          />
        );
      case "phone":
        return <PhoneBody user={user} setPhone={setPhone} />;
      default:
        return <div>- No content -</div>;
    }
  }, [profileState, user]);
  if (!user) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        {/* Profil section */}
        <Section
          header={`${user.nama} Profile Settings`}
          cta={cta}
          className={s.profil}
        >
          <div className={s.profil__navigation}>
            <Button
              onClick={() => setProfileState("nama")}
              type={determineType("nama")}
            >
              Nama
            </Button>
            <Button
              onClick={() => setProfileState("email")}
              type={determineType("email")}
            >
              Email
            </Button>
            <Button
              onClick={() => setProfileState("password")}
              type={determineType("password")}
            >
              Password
            </Button>
            <Button
              onClick={() => setProfileState("phone")}
              type={determineType("phone")}
            >
              Phone
            </Button>
          </div>
          {/* Profil body */}
          {renderBody}

          {alertMessage && (
            <div className={s.profil__alert}>
              <p>{alertMessage}</p>{" "}
              <span onClick={() => setAlertMessage("")}>x</span>
            </div>
          )}
        </Section>

        {/* Overlay */}
        {putOverlay && <div className={s.overlay}></div>}
      </>
    );
  }
}

const NamaBody = ({
  user,
  setNama,
}: {
  user: User;
  setNama: Dispatch<SetStateAction<string>>;
}) => {
  const [localNama, setLocalNama] = useState<string>(user?.nama as string);

  return (
    <div className={s.body + " " + s.body__name}>
      <div className={s.body__input}>
        <label htmlFor="nama" className={s.required}>
          Nama
        </label>
        <input
          type="text"
          value={localNama}
          onChange={(e) => {
            setNama(e.target.value.trimStart().trimEnd());
            setLocalNama(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const EmailBody = ({
  user,
  setEmail,
}: {
  user: User;
  setEmail: Dispatch<SetStateAction<string>>;
}) => {
  const [localEmail, setLocalEmail] = useState<string>(user?.email as string);

  return (
    <div className={s.body + " " + s.body__email}>
      <div className={s.body__input}>
        <label htmlFor="email" className={s.required}>
          email
        </label>
        <input
          type="email"
          value={localEmail}
          onChange={(e) => {
            setEmail(e.target.value.trimStart().trimEnd());
            setLocalEmail(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const PhoneBody = ({
  user,
  setPhone,
}: {
  user: User;
  setPhone: Dispatch<SetStateAction<string>>;
}) => {
  const [localPhone, setLocalPhone] = useState<string>(user?.phone as string);

  return (
    <div className={s.body + " " + s.body__phone}>
      <div className={s.body__input}>
        <label htmlFor="phone" className={s.required}>
          phone
        </label>
        <input
          type="text"
          value={localPhone}
          onChange={(e) => {
            setPhone(e.target.value.trimStart().trimEnd());
            setLocalPhone(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const PasswordBody = ({
  setOldPass,
  setNewPass,
  setVerifyPass,
}: {
  setOldPass: Dispatch<SetStateAction<string>>;
  setNewPass: Dispatch<SetStateAction<string>>;
  setVerifyPass: Dispatch<SetStateAction<string>>;
}) => {
  const [localOld, setLocalOld] = useState<string>("");
  const [localNew, setLocalNew] = useState<string>("");
  const [localVerify, setLocalVerify] = useState<string>("");

  return (
    <div className={s.body + " " + s.body__password}>
      <div className={s.body__header}>
        <ul>
          <li>
            Password baru harus mengandung minimal 1 huruf kecil dan 1 huruf
            kapital
          </li>
          <li>Password baru harus mengandung minimal 5 karakter</li>
          <li>Password baru tidak boleh sama dengan password lama</li>
          <li>Password baru dan konfirmasi password baru harus sama</li>
          <li>
            Perhatikan password baru karena anda akan diarahkan untuk login
            ulang setelah berhasil mengubah password
          </li>
        </ul>
      </div>
      <div className={s.body__input}>
        <label htmlFor="pwlama" className={s.required}>
          Password lama
        </label>
        <input
          type="password"
          value={localOld}
          onChange={(e) => {
            setOldPass(e.target.value.trimStart().trimEnd());
            setLocalOld(e.target.value);
          }}
        />
      </div>
      <div className={s.body__input}>
        <label htmlFor="pwbaru" className={s.required}>
          Password baru
        </label>
        <input
          type="password"
          value={localNew}
          onChange={(e) => {
            setNewPass(e.target.value.trimStart().trimEnd());
            setLocalNew(e.target.value);
          }}
        />
      </div>
      <div className={s.body__input}>
        <label htmlFor="verify" className={s.required}>
          Konfirmasi password baru
        </label>
        <input
          type="password"
          value={localVerify}
          onChange={(e) => {
            setVerifyPass(e.target.value.trimStart().trimEnd());
            setLocalVerify(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
