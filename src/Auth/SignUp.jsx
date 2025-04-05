import React, { useState } from "react";
import "react-phone-number-input/style.css";
import axios from "axios";
import { useToast, Spinner, Input } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Slide from "./Slide";

const SignUp = () => {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userPayload = {
    name,
    tag,
    email,
    phoneNumber,
    password,
  };

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !tag || !password || !email || !phoneNumber) {
      toast({
        title: "Fill in all fields",
        description: "Please make sure to fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (password && !confirmPassword) {
      toast({
        title: "Confirm password",
        description: "Please make sure to confirm your password.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your password matches.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/user/SignUp", {
        userPayload,
      });

      if (res.status === 201) {
        toast({
          title: "Account created",
          description: "We've created your account for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        const { createdUser, appwritePayload, jwtToken } = res.data;
        localStorage.setItem("streamPayload", JSON.stringify(createdUser));
        localStorage.setItem(
          "appwritePayload",
          JSON.stringify(appwritePayload)
        );
        localStorage.setItem("token", jwtToken);

        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating account",
        description:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-white flex-row">
      <div className="flex w-[50%] h-screen">
        <Slide />
      </div>
      <div className="form-container w-[50%] h-screen p-8 bg-white flex-col justify-center rounded-lg items-center flex">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 items-center justify-center w-[80%] h-full"
        >
          <fieldset className="border border-blue-500 w-full h-max p-2 items-center rounded-lg justify-center flex flex-col gap-6 px-3">
            <legend className="text-3xl font-bold text-blue-500">Register</legend>
            <Input
              variant="filled"
              type="text"
              placeholder="Your Full Name"
              className=" border-black border-[1px] p-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-required="true"
            />
            <Input
              variant="filled"
              type="tel"
              placeholder="Your Phone Number"
              className="border-black border-[1px] p-2 rounded-md"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              aria-required="true"
            />
            <Input
              variant="filled"
              type="email"
              placeholder="Your Email"
              className="border-black border-[1px] p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
            <Input
              variant="filled"
              type="text"
              placeholder="Your Tag"
              className="border-black border-[1px] p-2 rounded-md"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              aria-required="true"
            />
            <div className="flex flex-row w-full gap-4">
              <Input
                variant="filled"
                type="password"
                placeholder="Password"
                className="w-[50%] border-black border-[1px] p-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required="true"
              />
              <Input
                variant="filled"
                type="password"
                placeholder="Confirm Password"
                className="w-[50%] border-black border-[1px] p-2 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-required="true"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-black h-[50px] hover:bg-transparent hover:text-black hover:border-black hover:border-[1px] cursor-pointer rounded-lg text-white flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner size="md" /> : "Submit"}
          </button>
        </form>
        <p>
          Already have an account,{" "}
          <Link to="/Login" className="underline cursor-pointer text-blue-600">
            {" "}
            Login here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
