import React, { useEffect, useState } from "react";
import illustration1 from "../assets/GIF/Social update.gif";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(null);

  useEffect(() => {
    if (location.pathname === "/Auth/Login") {
      setIsSignUp(false);
    } else {
      setIsSignUp(false);
    }
  }, []);

  return (
    <div className="flex w-full dark:bg-darkBackground2 h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 overflow-hidden">
      {/* Left Video Panel */}
      <div className="hidden md:hidden lg:flex flex-1">
        <img src={illustration1} className="w-full h-full" alt="" animation />
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center px-4 md:px-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
          {/* Toggle Tabs */}
          <div className="flex justify-between mb-6 bg-gray-100 p-1 rounded-xl">
            <NavLink
              to="/Auth/SignUp"
              className={({ isActive }) =>
                `w-1/2 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive ? "bg-primary text-white shadow-md" : "text-primary"
                }`
              }
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/Auth/Login"
              className={({ isActive }) =>
                `w-1/2 text-center py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive ? "bg-primary text-white shadow-md" : "text-primary"
                }`
              }
              onClick={() => setIsSignUp(false)}
            >
              Log In
            </NavLink>
          </div>

          {/* Form Content with Animation */}
          <div className="w-full h-auto min-h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Forgot Password */}
          {isSignUp === false && (
            <div className="mt-4 text-center">
              <Link
                to="/ForgotPassword"
                className="text-sm text-primary underline hover:text-primary-dark transition"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
