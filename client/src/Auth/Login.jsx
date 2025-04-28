import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Divider,
  Flex,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSigningUpwithGoogle, setIsSigningUpwithGoogle] = useState(false);

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

      const { jwtToken } = response.data;
      localStorage.setItem("token", jwtToken);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed, please try again.";
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

  const handleGoogleSignIn = async (res) => {
    setIsSigningUpwithGoogle(true);
    const token = res.credential;

    try {
      const response = await axios.post(
        "http://localhost:5000/user/googleSignIn",
        { token }
      );
      const { jwtToken } = response.data;

      localStorage.setItem("token", jwtToken);
      toast({
        title: "Google sign-in successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: err.response?.data?.message || "Try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsSigningUpwithGoogle(false);
    }
  };

  return (
    <div className="flex w-full h-full justify-center flex-col items-stretch px-2">
      {/* <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-2xl backdrop-blur-sm"> */}

      <form className="flex flex-col gap-4" onSubmit={LoginUser}>
        <input
          type="email"
          placeholder="Your Email"
          className="p-2 border-primary border-[1px] outline-0 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Your Password"
          className="p-2 border-primary border-[1px] outline-0 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading || isSigningUpwithGoogle}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
            loading || isSigningUpwithGoogle
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-primary text-white hover:bg-green-600"
          }`}
        >
          {loading ? <Spinner size="sm" /> : "Log In"}
        </button>

        <Flex align="center" gap={4} mt={2}>
          <Divider />
          <Text fontSize="sm" color="gray.400">
            OR
          </Text>
          <Divider />
        </Flex>

        <div className="w-full flex">
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={() =>
                toast({
                  title: "Google sign-in failed",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                })
              }
              width="100%" // important for the Google button to stretch if supported
            />
          </div>
        </div>
      </form>
      {/* </div> */}
    </div>
  );
};

export default Login;
