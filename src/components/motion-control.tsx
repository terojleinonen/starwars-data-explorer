"use client";

import { useEffect, useState } from "react";

export default function MotionControl() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.getElementById("prologue");
    let visible = true;
    let requested = !preference.matches;
    let active = true;
    try { requested = localStorage.getItem("universe-motion") === "off" ? false : !preference.matches; } catch {}

    const update = () => {
      document.documentElement.dataset.motion = requested && !preference.matches && visible && !document.hidden ? "on" : "off";
    };
    const sync = () => {
      if (active) setEnabled(requested && !preference.matches);
      update();
    };
    const onPreference = () => {
      if (preference.matches) requested = false;
      sync();
    };
    const onToggle = (event: Event) => {
      requested = (event as CustomEvent<boolean>).detail;
      try { localStorage.setItem("universe-motion", requested ? "on" : "off"); } catch {}
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (hero) observer.observe(hero);
    document.addEventListener("visibilitychange", update);
    document.addEventListener("universe-motion-change", onToggle);
    preference.addEventListener("change", onPreference);
    // Sync after mounting without delaying the already-visible server content.
    queueMicrotask(sync);
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("universe-motion-change", onToggle);
      preference.removeEventListener("change", onPreference);
      delete document.documentElement.dataset.motion;
    };
  }, []);

  return (
    <button
      className="motion-control"
      type="button"
      aria-label="Ambient animation"
      aria-pressed={enabled}
      onClick={() => document.dispatchEvent(new CustomEvent("universe-motion-change", { detail: !enabled }))}
    >
      <span className="motion-bars" aria-hidden="true"><i /><i /><i /><i /></span>
      Motion {enabled ? "on" : "off"}
    </button>
  );
}
