import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmailThunk } from "@redux/thunks/auth.thunk";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { toast } from "sonner";
import { TriangleAlert, CheckCircle, X } from "lucide-react";
import { resetVerificationSuccess } from "@redux/slices/auth.slice";

const EmailVerificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // "verifying", "success", "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentMessage, setResentMessage] = useState("");
  const [resentError, setResentError] = useState("");
  const userEmail = useSelector((state) => state.Auth?.user?.email || "");

  // Reset verification state on mount
  useEffect(() => {
    dispatch(resetVerificationSuccess());
  }, [dispatch]);

  // Get verification state from Redux
  const { loadingVerification, verificationSuccess, isVerificationError } = useSelector((state) => state.Auth);

  // Parse URL parameters and auto-verify on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log("[EmailVerificationPage] location.search:", location.search);
    const tokenParam = params.get("token");
    console.log("[EmailVerificationPage] Extracted token:", tokenParam);

    if (tokenParam) {
      handleAutoVerify(tokenParam);
    } else {
      setManualMode(true);
      setVerificationStatus("idle");
    }
  }, [location.search]);

  const handleAutoVerify = async (token) => {
    try {
      console.log("[EmailVerificationPage] Calling verifyEmailThunk with jwt_token only:", { token });
      await dispatch(
        verifyEmailThunk({
          jwt_token: token,
        })
      ).unwrap();
      console.log("[EmailVerificationPage] Verification successful");
      setVerificationStatus("success");
      toast.success("Email verified successfully!", {
        position: "top-center",
        icon: <CheckCircle className="text-green-500" size={20} />,
        description: "You can now log in to your account.",
      });
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(error.message || "Verification failed. Please try again.");
      toast.error(error.message || "Verification failed. Please try again.", {
        position: "top-center",
        icon: <TriangleAlert className="text-red-500" size={20} />,
      });
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setVerificationStatus("verifying");
    setErrorMessage("");
    try {
      await dispatch(
        verifyEmailThunk({ jwt_token: manualToken })
      ).unwrap();
      setVerificationStatus("success");
      toast.success("Email verified successfully!", {
        position: "top-center",
        icon: <CheckCircle className="text-green-500" size={20} />,
        description: "You can now log in to your account.",
      });
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(error.message || "Verification failed. Please try again.");
      toast.error(error.message || "Verification failed. Please try again.", {
        position: "top-center",
        icon: <TriangleAlert className="text-red-500" size={20} />,
      });
    }
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleResend = async () => {
    setResending(true);
    setResentMessage("");
    setResentError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://tcsm-backend-495533701737.europe-west1.run.app"}/auth/resend-email?email=${encodeURIComponent(userEmail)}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (response.ok) {
        setResentMessage("Verification link resent! Please check your email.");
      } else {
        setResentError(data.message || "Failed to resend verification link.");
      }
    } catch (err) {
      setResentError("Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <img
            src="/src/assets/logo.png"
            alt="Turtle Conservation Society"
            className="h-12 md:h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl md:text-3xl font-serif text-[#666639] mb-2">
            Email Verification
          </h1>
        </div>

        {verificationStatus === "verifying" && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Spinner size="lg" className="text-[#666639]" />
            </div>
            <p className="text-gray-600 text-lg">
              Verifying your email address...
            </p>
            <p className="text-gray-500 text-sm">
              Please wait while we verify your account.
            </p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="text-green-500 h-12 w-12 md:h-16 md:w-16 mr-3" />
              <h2 className="text-2xl md:text-3xl font-serif text-[#666639]">Verification Successful!</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-lg">
                Your email has been verified successfully!
              </p>
              <p className="text-gray-600">
                You can now log in to your account and start using our services.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>What's next?</strong>
                </p>
                <ul className="text-green-700 text-sm mt-2 space-y-1">
                  <li>• Return to the homepage</li>
                  <li>• Click "Log In" in the navigation</li>
                  <li>• Enter your email and password</li>
                  <li>• Start exploring the platform</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleGoToLogin}
              color="gray"
              className="w-full bg-[#666639] hover:bg-[#4D6A4D] text-white rounded-lg transition-colors py-3 text-lg"
            >
              Go to Homepage
            </Button>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <TriangleAlert className="text-red-500 h-12 w-12 md:h-16 md:w-16 mr-3" />
              <h2 className="text-2xl md:text-3xl font-serif text-[#666639]">Verification Failed</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-lg">
                We couldn't verify your email address.
              </p>
              <p className="text-red-600 text-sm">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoToLogin}
                color="gray"
                className="w-full bg-[#666639] hover:bg-[#4D6A4D] text-white rounded-lg transition-colors py-3 text-lg"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        )}

        {manualMode && verificationStatus !== "success" && (
          <div className="text-center text-gray-600 mt-4">
            A verification link was sent to your email.<br />
            Didn’t get it?
            <button
              onClick={handleResend}
              className="ml-2 text-[#4D6A4D] underline hover:text-[#666639] font-medium"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend link"}
            </button>
            {resentMessage && (
              <div className="mt-2 text-green-600">{resentMessage}</div>
            )}
            {resentError && (
              <div className="mt-2 text-red-600">{resentError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage; 