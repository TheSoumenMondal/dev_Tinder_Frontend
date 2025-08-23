"use client";

import BrightnessSvg from "@/assets/icons/brightness";
import { useTheme } from "next-themes";
import React from "react";

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const handleThemeChange = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };
  return (
    <button
      aria-label="Toggle theme"
      onClick={handleThemeChange}
      className="cursor-pointer"
    >
      <BrightnessSvg className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;


