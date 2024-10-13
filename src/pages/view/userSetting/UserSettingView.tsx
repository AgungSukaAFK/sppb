"use client";
import Section, { CtaType } from "@/pages/component/Section";
import s from "./index.module.scss";
import { User, UserSettings } from "@/types";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const dynamic = "force-dynamic";

interface Props {
  userSetting?: UserSettings;
  user: User;
}

export default function UserSettingView({ user }: Props) {
  const cta: CtaType = [
    {
      type: "primary",
      text: "Save",
      onClick: onSave,
    },
  ];

  const themeSelectorRef = useRef<HTMLSelectElement | null>(null);
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  // Update selectedTheme when theme changes
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  async function onSave() {
    if (themeSelectorRef.current) {
      const newTheme = themeSelectorRef.current.value;
      setTheme(newTheme);
      setSelectedTheme(newTheme); // Update selectedTheme to reflect new selection
    }
  }

  return (
    <>
      {/* Section: User Setting */}
      {user ? (
        <Section
          header={`${user.nama}'s Setting`}
          className={s.setting}
          cta={cta}
        >
          <div className={s.setting__item}>
            <span>Theme preference</span>
            <select
              value={selectedTheme}
              ref={themeSelectorRef}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <optgroup label="Light">
                <option value="jupiter">Jupiter</option>
                <option value="nebula">Nebula</option>
              </optgroup>
              <optgroup label="Dark">
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
