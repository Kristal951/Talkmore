import React from "react";
import ThemeToggle from "../../others/ThemeToggle";

const ThemeSwitch = () => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">Theme</span>
      <ThemeToggle />
    </div>
  );
};

export default ThemeSwitch;
