import React from "react";
import FontSizeSettings from "../../others/FontSizeSettings";

const FontSizeSwitcher = () => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">Font Size</span>
      <FontSizeSettings />
    </div>
  );
};

export default FontSizeSwitcher;
