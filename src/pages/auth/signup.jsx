import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "@redux/thunks/auth.thunk";
import { resetRegistrationSuccess } from "@redux/slices/auth.slice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput, Button, Spinner } from "flowbite-react";
import { X, Eye, EyeOff, TriangleAlert, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const SignUp = ({ onClose, onLoginClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const dispatch = useDispatch();
  const { loadingRegister, isRegistrationError, registrationSuccess } = useSelector((state) => state.Auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    console.log("Form data:", data);
    try {
      await dispatch(registerThunk(rest)).unwrap();
      setShowVerificationMessage(true);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.", {
        icon: <TriangleAlert className="text-red-500" size={20} />,
      });
    }
  };

  const handleGoToLogin = () => {
    dispatch(resetRegistrationSuccess());
    setShowVerificationMessage(false);
    onClose();
    if (onShowVerifyEmail) {
      onShowVerifyEmail();
    }
  };

  const handleClose = () => {
    dispatch(resetRegistrationSuccess());
    setShowVerificationMessage(false);
    onClose();
  };

  const handleManualVerification = () => {
    dispatch(resetRegistrationSuccess());
    setShowVerificationMessage(false);
    onClose();
    if (onShowVerifyEmail) {
      onShowVerifyEmail();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xl relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-white text-md"
          >
            <X />
          </button>
          
          {showVerificationMessage ? (
            <div className="text-center">
              <div className="mb-4 md:mb-6">
                <img
                  src="src/assets/logo.png"
                  alt="Turtle Conservation Society"
                  className="h-10 md:h-12 mx-auto mb-2"
                />
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-500 h-10 w-10 md:h-12 md:w-12 mr-2" />
                  <h1 className="text-3xl md:text-4xl font-serif text-[#666639]">Registration Successful!</h1>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-lg">
                  Thank you for registering! We've sent a verification email to your inbox.
                </p>
                <p className="text-gray-600">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleGoToLogin}
                  color="gray"
                  className="w-full bg-[#666639] hover:bg-[#4D6A4D] text-white rounded-lg transition-colors py-2"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4 md:mb-6">
                <img
                  src="src/assets/logo.png"
                  alt="Turtle Conservation Society"
                  className="h-10 md:h-12 mx-auto mb-2"
                />
                <h1 className="text-3xl md:text-4xl font-serif text-[#666639]">Sign Up</h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-600 text-lg mb-2">Name</label>
                    <TextInput
                      type="text"
                      {...register("name")}
                      helperText={errors.name?.message}
                      color={errors.name ? "failure" : "gray"}
                      className="rounded-lg"
                    />
                  </div>
                </div>
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
                <div>
                  <label className="block text-gray-600 text-lg mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <TextInput
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      helperText={errors.confirmPassword?.message}
                      color={errors.confirmPassword ? "failure" : "gray"}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      color="gray"
                      size="xs"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute p-0 right-2 bg-transparent bottom-2 border-none"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={loadingRegister}
                  color="gray"
                  className={`w-full flex flex-row items-center justify-center gap-2 ${
                    loadingRegister
                      ? "bg-gray-400"
                      : "bg-[#666639] hover:bg-[#4D6A4D]"
                  } text-white rounded-lg transition-colors py-1`}
                >
                  {loadingRegister && <Spinner size="sm" className="text-white" />}
                  {loadingRegister ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoToLogin();
                  }}
                  className="text-[#666639] hover:underline"
                >
                  Already have an account? Log In
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;
