import React from "react";
import ThemeSwitch from "./ThemeSwitcher";
import FontSizeSwitcher from "./FontSizeSwitcher";

const Index = () => {
  return (
    <section className="flex flex-col w-2/4 gap-2 p-4 border rounded-md bg-white dark:bg-darkBackground2 shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-4 dark:text-white">
        Appearance
      </h2>
      <ThemeSwitch/>
      <FontSizeSwitcher/>
    </section>
  );
};

export default Index;
