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
    <div className="font-size-settings flex items-center gap-4 p-2 bg-gray-100 dark:bg-opacity-25 dark:bg-primary rounded-lg shadow-md">
      <div className="font-size-options flex gap-4">
        <button
          onClick={() => handleFontSizeChange("small")}
          className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-2 ${
            fontSize === "small"
              ? "bg-primary text-white border-primary"
              : "bg-gray-200 text-gray-800 dark:border-[1px] dark:border-primary border-transparent hover:bg-gray-300 dark:bg-transparent dark:text-white dark:hover:bg-gray-500"
          }`}
        >
          Small
        </button>
        <button
          onClick={() => handleFontSizeChange("medium")}
          className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-2 ${
            fontSize === "medium"
              ? "bg-primary text-white border-primary"
              : "bg-gray-200 text-gray-800 dark:border-[1px] dark:border-primary border-transparent hover:bg-gray-300 dark:bg-transparent dark:text-white dark:hover:bg-gray-500"
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => handleFontSizeChange("large")}
          className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-300 border-[1px] ${
            fontSize === "large"
              ? "bg-primary text-white border-primary"
              : "bg-gray-200 text-gray-800 dark:border-[1px] dark:border-primary border-transparent hover:bg-gray-300 dark:bg-transparent dark:text-white dark:hover:bg-gray-500"
          }`}
        >
          Large
        </button>
      </div>
    </div>
  );
};

export default FontSizeSettings;
