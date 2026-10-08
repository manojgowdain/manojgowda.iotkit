"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Change theme"}
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Change theme"}
      type="button"
    >
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
