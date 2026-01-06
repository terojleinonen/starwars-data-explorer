"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "nav-history";
const MAX_VISIBLE = 5;

export default function BreadcrumbsHistoryEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.querySelector(
      "[data-breadcrumbs]"
    );
    if (!nav) return;

    const ol = nav.querySelector("ol");
    if (!ol) return;

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const history: {
      href: string;
      label: string;
    }[] = JSON.parse(raw);

    if (history.length < 2) return;

    const visible =
      history.length > MAX_VISIBLE
        ? [
            history[0],
            { label: "…", href: "" },
            ...history.slice(-MAX_VISIBLE + 1),
          ]
        : history;

    ol.innerHTML = "";

    visible.forEach((item, index) => {
      const li = document.createElement("li");

      if (item.href && item.label !== "…") {
        const a = document.createElement("a");
          a.href = item.href;
          a.textContent = item.label;
          a.setAttribute("data-nav-label", item.label)
        li.appendChild(a);
      } else {
        li.textContent = item.label;
      }

      if (index < visible.length - 1) {
        li.insertAdjacentText("beforeend", "");
      }

      ol.appendChild(li);
    });
  }, [pathname]); // 🔥 THIS is the fix

  return null;
}