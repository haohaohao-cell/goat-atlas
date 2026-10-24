"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon, MenuIcon, CloseIcon } from "./Icons";
import { Logo } from "./Logo";
import { siteConfig } from "@/lib/site";

const NAV = [
  { href: "/atlas", label: "Atlas", cn: "图鉴" },
  { href: "/story", label: "Story", cn: "故事" },
  { href: "/live", label: "Live", cn: "动态" },
  { href: "/matches", label: "Matches", cn: "赛程" },
  { href: "/play", label: "Play", cn: "玩法" },
  { href: "/about", label: "About", cn: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Logo />

        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="主导航">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? "is-active" : ""}
            >
              <span>{item.label}</span>
              <em>{item.cn}</em>
            </Link>
          ))}

          {siteConfig.githubUrl ? (
            <a
              className="nav-github"
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon />
              GitHub
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </div>
    </header>
  );
}
