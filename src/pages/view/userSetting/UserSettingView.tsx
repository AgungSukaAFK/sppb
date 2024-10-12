"use client";
import Section, { CtaType } from "@/pages/component/Section";
import s from "./index.module.scss";
import { User, UserSettings } from "@/types";
import { useRef } from "react";
import { useTheme } from "next-themes";

export const dynamic = "force-dynamic";

interface Props {
  userSetting: UserSettings;
  user: User;
}

export default function UserSettingView({ userSetting, user }: Props) {
  const cta: CtaType = [
    {
      type: "primary",
      text: "Save",
      onClick: onSave,
    },
  ];

  const themeSelectorRef = useRef<HTMLSelectElement | null>(null);

  const { setTheme } = useTheme();

  async function onSave() {
    const themeSelector = themeSelectorRef.current;
    if (themeSelector) {
      setTheme(themeSelector.value);
    }
  }

  return (
    <>
      {/* Section: User Setting */}
      {user && userSetting ? (
        <Section
          header={`${user.nama}'s Setting`}
          className={s.setting}
          cta={cta}
        >
          <div className={s.setting__item}>
            <span>Theme preference</span>
            <select defaultValue={userSetting.theme} ref={themeSelectorRef}>
              <optgroup label="Light">
                <option value="jupiter">Jupiter</option>
                <option value="nebula">Nebula</option>
              </optgroup>
              <optgroup label="dark">
                <option value="dark">Dark</option>
              </optgroup>
            </select>
          </div>
        </Section>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
}
