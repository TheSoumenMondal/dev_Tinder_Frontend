"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

const MobileThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <div
      onClick={handleThemeChange}
      className="w-full gap-2 h-12 justify-start px-0 flex items-center cursor-pointer select-none"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="text-sm font-semibold">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="text-sm font-semibold">Dark</span>
        </>
      )}
    </div>
  );
};

export default MobileThemeToggle;
