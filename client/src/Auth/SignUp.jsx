import {
  Button,
  Divider,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Slide from "./Slide";
import { useRef, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSigningUpwithGoogle, setIsSigningUpwithGoogle] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const form = useRef();

  const sendWelcomeMsg = async () => {
    try {
      await emailjs.sendForm(
        "service_p6kig1e",
        "template_60eh2y9",
        form.current,
        {
          publicKey: "Si4-o4VjXbVTtgTtR",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !tag ||
      !password ||
      !email ||
      password !== confirmPassword
    ) {
      toast({
        title: "Check your inputs",
        description:
          "Please fill out all fields and confirm password correctly.",
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
        userPayload: { name, tag, email, password },
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

        await sendWelcomeMsg();

        const { jwtToken } = res.data;
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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (res) => {
    setIsSigningUpwithGoogle(true);
    const token = res.credential;

    try {
      const response = await axios.post(
        "http://localhost:5000/user/googleSignup",
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
      console.error(err);
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
    <div className="w-full h-full flex">
      <div className="w-full items-start justify-center bg-white">
        <form
          className="gap-3 flex items-stretch pt-3 flex-col"
          onSubmit={handleSubmit}
          ref={form}
        >
          <input
            className="border-primary border-[1px] p-2 rounded-lg outline-0"
            placeholder="Name"
            name="user_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border-primary border-[1px] p-2 rounded-lg outline-0"
            placeholder="Email"
            type="email"
            name="user_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border-primary border-[1px] p-2 rounded-lg outline-0"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <div className="w-full h-max flex gap-[10%]">
            <input
              className="border-primary w-[45%] border-[1px] p-2 rounded-lg outline-0"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="border-primary w-[45%] border-[1px] p-2 rounded-lg outline-0"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            colorScheme="green"
            isLoading={loading}
            isDisabled={loading || isSigningUpwithGoogle}
            loadingText="Submitting"
          >
            Sign Up
          </Button>

          <Flex align="center" gap={4}>
            <Divider />
            <Text fontSize="sm" color="#41cc69">
              OR
            </Text>
            <Divider />
          </Flex>

          {isSigningUpwithGoogle ? (
            <Button isLoading loadingText="Signing up..." colorScheme="gray" />
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() =>
                toast({
                  title: "Google sign-in failed",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right",
                })
              }
              buttonText="Sign Up with Google"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
