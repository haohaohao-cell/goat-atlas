"use client";

import { usePathname, useRouter } from "next/navigation";
import { GlobeIcon } from "./Icons";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.startsWith("/en")
    ? "en"
    : pathname.startsWith("/pt")
      ? "pt"
      : "zh";

  function change(value: string) {
    if (value === "en") router.push("/en");
    else if (value === "pt") router.push("/pt");
    else router.push("/");
  }

  return (
    <label className="lang-switch">
      <GlobeIcon />
      <select
        value={current}
        onChange={(event) => change(event.target.value)}
        aria-label="Language / 语言"
      >
        <option value="zh">中文</option>
        <option value="en">EN</option>
        <option value="pt">PT</option>
      </select>
    </label>
  );
}
