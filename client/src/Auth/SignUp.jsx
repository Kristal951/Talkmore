import { Button, Divider, Flex, Text, useToast } from "@chakra-ui/react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { GoogleLogin } from "@react-oauth/google";
import { checkIfTagExists } from "../lib/AppriteFunction";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSigningUpwithGoogle, setIsSigningUpwithGoogle] = useState(false);
  const [tagMessage, setTagMessage] = useState("");
  const [isTagAvailable, setIsTagAvailable] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  const form = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkTag = async (tag) => {
    setFormData((prev) => ({ ...prev, tag }));
    setLoading(true);

    try {
      const tagCheck = await checkIfTagExists(tag);
      setTagMessage(tagCheck.message);
      setIsTagAvailable(tagCheck.status);
      console.log(tagMessage, isTagAvailable)
    } catch (error) {
      console.error(error);
      toast({
        title: "Tag unavailable",
        description:
          "The tag you plan on using is already being used by another user.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeMsg = async () => {
    try {
      await emailjs.sendForm(
        "service_p6kig1e",
        "template_60eh2y9",
        form.current,
        { publicKey: "Si4-o4VjXbVTtgTtR" }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, tag, email, password, confirmPassword } = formData;

    if (!name || !tag || !email || !password || password !== confirmPassword) {
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

      await sendWelcomeMsg();
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
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            className="border-primary border-[1px] p-2 rounded-lg outline-0"
            placeholder="Your Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />

          <div className="flex w-full h-max flex-col">
            <div className="flex w-full h-max">
              <div className="bg-gray-100 flex py-2 px-3 border-[1px] rounded-l-lg border-r-0 border-primary text-primary font-bold">
                <p className="text-xl">@</p>
              </div>
              <input
                className="border-primary w-full border-[1px] p-2 rounded-r-lg outline-0"
                placeholder="Your Tag"
                type="text"
                value={formData.tag}
                onChange={(e) => checkTag(e.target.value)}
              />
            </div>
            <div className="flex w-full h-max ml-1 mt-1 mb-1">
              {tagMessage && (
                <p
                  className={`text-sm ${
                    tagMessage.toLowerCase().includes("already exists")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {tagMessage}
                </p>
              )}
            </div>
          </div>

          <div className="w-full h-max flex gap-[10%]">
            <input
              className="border-primary w-[45%] border-[1px] p-2 rounded-lg outline-0"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              className="border-primary w-[45%] border-[1px] p-2 rounded-lg outline-0"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <Button
            type="submit"
            colorScheme="green"
            isLoading={loading}
            isDisabled={loading || isSigningUpwithGoogle || isTagAvailable === false}
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
