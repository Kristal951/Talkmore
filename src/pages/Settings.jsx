import React from "react";
import ThemeToggle from "../components/others/ThemeToggle";
import FontSizeSettings from "../components/others/FontSizeSettings";
import { FaRegTrashAlt } from "react-icons/fa";
import Index from "../components/SettingsComponents/Appearence/Index";

const Settings = () => {
  return (
    <div className="w-full h-screen p-4 bg-gray-50 dark:text-white transition-colors dark:bg-darkBackground">
      {/* Page Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold text-primary">
          Settings
        </h1>
      </header>

      {/* Settings Sections */}
      <main className="flex w-full h-full flex-col gap-4">
      
        <Index/>
        <section className="flex flex-col w-2/4 gap-2 p-4 border rounded-md bg-white dark:bg-darkBackground2 shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-4 ">
            Account
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-lg">Delete Account</span>
          </div>

          <div>
            <span></span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
