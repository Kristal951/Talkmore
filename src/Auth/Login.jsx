import React, { useContext, useState } from "react";
import "react-phone-number-input/style.css";
import axios from "axios";
import { Input, Spinner, useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";
import illustration1 from "../assets/illustrations/Social_update_1.mp4";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext);

  const LoginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast({
        title: "Invalid Input",
        description: "Email and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5000/user/Login", {
        email,
        password,
      });
      const { user, jwtToken } = response.data;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("appwritePayload", JSON.stringify(user));

      navigate("/");

      setUserDetails({
        id: user.$id,
        name: user.name,
        tag: user.tag,
        email: user.email,
        phoneNumber: user.phoneNumber,
        imgUrl: user.imgURL,
      });

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed, please try again.";
      console.error("Login error:", errorMessage);

      toast({
        title: "Login Unsuccessful",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-white justify-start items-center relative">
      {/* Video Section */}
      <div className="flex md:w-[50%] w-[100%] h-screen">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src={illustration1} type="video/mp4" />
        </video>
      </div>

      <div className="flex absolute bg-black inset-0 md:hidden bg-opacity-30 z-10"></div>

      {/* Login Form Section */}
      <div className="flex md:w-[50%] w-full absolute md:relative h-screen flex-col justify-center items-center z-50">
        <div className="flex p-2 w-[80%] h-full flex-col items-center justify-center">
          <form
            onSubmit={LoginUser}
            className="flex backdrop-blur-sm md:backdrop-blur-none flex-col gap-6 items-center justify-center w-full h-full"
          >
            <fieldset className="border border-blue-500 w-full h-[50%] items-center rounded-lg justify-center flex flex-col gap-6 px-3">
              <legend className="text-3xl font-bold text-blue-500">Login In</legend>
              <Input
                type="email"
                variant="filled"
                placeholder="Your Email"
                className="w-full p-3 rounded-md -translate-y-[20px] focus:ring-[1px] focus:ring-blue-500 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
              <Input
                type="password"
                variant="filled"
                placeholder="Password"
                className="w-full p-3 rounded-md -translate-y-[10px] focus:ring-[1px] focus:ring-blue-500 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <button
                type="submit"
                className={`w-[80%] h-[50px] rounded-lg text-white transition duration-200 ${
                  loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? <Spinner size="md" /> : <p>Login</p>}
              </button>
            </fieldset>
            <div className="flex w-max h-max items-center justify-center flex-col">
            <p className="p-2 text-blue-500">
              Don't have an account?{" "}
              <Link
                to="/SignUp"
                className="underline cursor-pointer text-blue-600"
              >
                Sign up here.
              </Link>
            </p>
            <Link
              to="/ForgotPassword"
              className="text-blue-600 underline cursor-pointer"
            >
              Forgot Password?
            </Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
