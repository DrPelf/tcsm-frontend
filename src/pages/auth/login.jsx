import React, { useState } from "react";
import SignUp from "../../pages/auth/signup";
import ForgotPassword from "./ForgotPassword";
import VerificationCode from "./VerificationCode";
import { login } from "@redux/thunks/auth.thunk";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { UserRound, X, TriangleAlert, Eye, EyeOff } from "lucide-react";
import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import VerifyEmail from "./VerifyEmail";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Login = ({ onClose, onSignUpClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const handleVerification = () => {
    setShowVerification(true);
  };

  const onSubmit = async (data) => {
    try {
      setUserEmail(data.email); // Store email for verification if needed
      await dispatch(login(data)).unwrap();
      toast.success("Log In successful", {
        position: "top-center",
      });
      onClose();
    } catch (error) {
      console.log(error);
      if (error.message === "User account not verified.") {
        toast.error("Account not verified", {
          position: "top-center",
          duration: 10000, // 10 seconds, hmm to do more or not to do more?
          icon: <TriangleAlert className="text-yellow-500" size={20} />,
          description: "Your account needs to be verified to continue.",
          action: {
            label: "Verify Now",
            onClick: handleVerification,
          },
        });
      } else {
        toast.error(error.message || "Log In failed. Try again later.", {
          icon: <TriangleAlert className="text-red-500" size={20} />,
          position: "top-center",
        });
      }
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  if (showVerification) {
    return (
      <VerifyEmail
        onClose={() => setShowVerification(false)}
       
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onClose={() => {
          setShowForgotPassword(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white text-md"
        >
          <X />
        </button>
        <div className="text-center mb-6 md:mb-8">
          <img
            src="src/assets/logo.png"
            alt="Turtle Conservation Society"
            className="h-10 md:h-12 mx-auto mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-serif text-[#666639]">Login</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-lg mb-2">Email</label>
            <TextInput
              type="email"
              {...register("email")}
              helperText={errors.email?.message}
              color={errors.email ? "failure" : "gray"}
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-lg mb-2">Password</label>
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                {...register("password")}
                helperText={errors.password?.message}
                color={errors.password ? "failure" : "gray"}
                className="rounded-lg"
              />
              <Button
                type="button"
                color="gray"
                size="xs"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute p-0 right-2 bg-transparent bottom-2 border-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            color="gray"
            className="w-full bg-[#666639] text-white rounded-lg hover:bg-[#4D6A4D] transition-colors py-2"
          >
            Log in
          </Button>
        </form>
        <div className="mt-6 flex justify-between text-[#666639] text-sm">
          <a
            href="#"
            onClick={handleForgotPasswordClick}
            className="hover:underline"
          >
            Forgot Password?
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSignUpClick();
            }}
            className="hover:underline"
          >
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
