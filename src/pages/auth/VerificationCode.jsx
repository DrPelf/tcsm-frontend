import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmailThunk,
  verifyForgotPasswordTokenThunk,
} from "@redux/thunks/auth.thunk";
import ResetPassword from "./ResetPassword";
import { toast } from "sonner";
import { TriangleAlert, CheckCircle, X, Mail } from "lucide-react";
import { Button, Spinner } from "flowbite-react";

const VerificationCode = ({ onClose, email = "", isPasswordReset = false }) => {
  const [code, setCode] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState(email);
  const dispatch = useDispatch();

  const {
    loadingVerification,
    verificationSuccess,
    isVerifyTokenLoading,
    isVerifyTokenError,
    verifyTokenMessage,
  } = useSelector((state) => state.Auth);

  const handleChange = (e) => {
    setCode(e.target.value);
    setError("");
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError("Please enter verification code");
      return;
    }

    if (!userEmail) {
      setError("Email is required");
      return;
    }

    try {
      if (isPasswordReset) {
        // For password reset verification
        await dispatch(
          verifyForgotPasswordTokenThunk({
            email: userEmail,
            reset_code: code,
          })
        ).unwrap();

        toast.success("Reset code verified successfully!", {
          position: "top-center",
          icon: <CheckCircle className="text-green-500" size={20} />,
        });

        setShowResetPassword(true);
      } else {
        // For email verification
        await dispatch(
          verifyEmailThunk({
            email: userEmail,
            verification_code: code,
          })
        ).unwrap();

        toast.success("Email verified successfully!", {
          position: "top-center",
          icon: <CheckCircle className="text-green-500" size={20} />,
        });

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || "Verification failed. Please try again.", {
        position: "top-center",
        icon: <TriangleAlert className="text-red-500" size={20} />,
      });
      setError("Invalid verification code. Please try again.");
    }
  };

  if (showResetPassword) {
    return (
      <ResetPassword
        onClose={onClose}
        email={userEmail}
        resetCode={code}
      />
    );
  }

  if (!isPasswordReset && verificationSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#666639] bg-white hover:underline text-md"
          >
            <X />
          </button>
          <div className="text-center mb-6 md:mb-8">
            <img
              src="src/assets/logo.png"
              alt="Turtle Conservation Society"
              className="h-10 md:h-12 mx-auto mb-2"
            />
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-green-500 h-10 w-10 md:h-12 md:w-12 mr-2" />
              <h1 className="text-3xl md:text-4xl font-serif text-[#666639]">Verified!</h1>
            </div>
            <p className="text-gray-600 mb-4 md:mb-6">
              Your email has been verified successfully. You can now login to
              your account.
            </p>

            <Button
              color="gray"
              onClick={onClose}
              className="w-full bg-[#666639] hover:bg-[#4D6A4D] text-white rounded-lg transition-colors py-2"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666639] bg-white hover:underline text-md"
        >
          <X />
        </button>
        <div className="text-center mb-6 md:mb-8">
          <img
            src="src/assets/logo.png"
            alt="Turtle Conservation Society"
            className="h-10 md:h-12 mx-auto mb-2"
          />
          <h1 className="text-3xl md:text-4xl font-serif text-[#666639] mb-4">
            {isPasswordReset ? "Reset Code" : "Verification Code"}
          </h1>
          <p className="text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                value={userEmail}
                onChange={handleEmailChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#666639]"
                disabled={true}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">
              Verification Code
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={code}
                onChange={handleChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#666639]"
                disabled={isVerifyTokenLoading || loadingVerification}
                required
                maxLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            color="gray"
            disabled={
              isVerifyTokenLoading ||
              loadingVerification ||
              code.length !== 1 ||
              !userEmail
            }
            className={`w-full flex items-center justify-center gap-2 ${
              isVerifyTokenLoading || loadingVerification
                ? "bg-gray-400"
                : "bg-[#666639] hover:bg-[#4D6A4D]"
            } text-white rounded-lg transition-colors py-2`}
          >
            {(isVerifyTokenLoading || loadingVerification) && (
              <Spinner size="sm" className="text-white" />
            )}
            {isVerifyTokenLoading || loadingVerification
              ? "Verifying..."
              : "Verify Code"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerificationCode;
