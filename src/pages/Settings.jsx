import React from "react";
import ThemeToggle from "../components/others/ThemeToggle";
import FontSizeSettings from "../components/others/FontSizeSettings";

const Settings = () => {
  return (
    <div className="w-full h-screen p-4 bg-gray-50 dark:text-white transition-colors dark:bg-darkBackground">
      {/* Page Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold text-primary dark:text-white">
          Settings
        </h1>
      </header>

      {/* Settings Sections */}
      <main className="flex w-full h-full flex-col gap-4">
        <section className="flex flex-col w-2/4 gap-2 p-4 border rounded-md bg-white dark:bg-darkBackground2 shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-4 dark:text-white">Appearance</h2>

          <div className="flex items-center justify-between">
            <span className="text-lg">Theme</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg">Font Size</span>
            <FontSizeSettings />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
