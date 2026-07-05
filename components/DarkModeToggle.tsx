"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem("rtp_dark_mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored !== null ? stored === "true" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("rtp_dark_mode", String(next));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className="rounded-xl border-border/60 hover:border-primary/60 transition-all"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
}
