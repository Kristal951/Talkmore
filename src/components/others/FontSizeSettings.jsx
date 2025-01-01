import React, { useState, useEffect } from "react";
import "../../index.scss";

const FontSizeSettings = () => {
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    // Load font size from localStorage or fallback to 'medium'
    const savedFontSize = localStorage.getItem("fontSize") || "medium";
    setFontSize(savedFontSize);

    // Apply the font size to the document
    document.documentElement.style.setProperty(
      "--font-size-medium",
      `var(--font-size-${savedFontSize})`
    );
  }, []);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.style.setProperty(
      "--font-size-medium",
      `var(--font-size-${size})`
    );
    localStorage.setItem("fontSize", size);
  };

  return (
    <div className="font-size-settings">
      <div className="font-size-options">
        <button
          onClick={() => handleFontSizeChange("small")}
          className={
            fontSize === "small"
              ? "active"
              : " rounded-lg dark:bg-darkBackground dark:border-0 dark:text-white border-primary border-[1px]"
          }
        >
          Small
        </button>
        <button
          onClick={() => handleFontSizeChange("medium")}
          className={
            fontSize === "medium"
              ? "active"
              : " rounded-lg dark:bg-darkBackground dark:border-0 dark:text-white border-primary border-[1px]"
          }
        >
          Medium
        </button>
        <button
          onClick={() => handleFontSizeChange("large")}
          className={
            fontSize === "large"
              ? "active"
              : " rounded-lg dark:bg-darkBackground dark:border-0 dark:text-white border-primary border-[1px]"
          }
        >
          Large
        </button>
      </div>
    </div>
  );
};

export default FontSizeSettings;
