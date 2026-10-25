"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = `${siteConfig.basePath}/sw.js`;

    const register = () => {
      navigator.serviceWorker.register(swUrl).catch(() => {
        // 注册失败不影响站点使用；离线能力只是增强。
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }

    return () => {
      window.removeEventListener("load", register);
    };
  }, []);

  return null;
}
