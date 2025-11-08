import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmailThunk, resendVerificationEmailThunk } from "@redux/thunks/auth.thunk";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner, Alert, Button } from "flowbite-react";
import { toast } from "sonner";
import { TriangleAlert, CheckCircle, X } from "lucide-react";
import { resetVerificationSuccess } from "@redux/slices/auth.slice";

const VerifyEmail = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [isVerificationError, setIsVerificationError] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentMessage, setResentMessage] = useState("");
  const [resentError, setResentError] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const userEmail = useSelector((state) =>
    state.Auth?.user?.email || state.Auth?.pendingVerificationEmail || ""
  );
  console.log("[VerifyEmail] userEmail from Redux:", userEmail);
  console.log('verifying:', verifying, 'isVerificationError:', isVerificationError);

  // Reset verification state on mount
  useEffect(() => {
    dispatch(resetVerificationSuccess());
  }, [dispatch]);

  // Get verification state from Redux
  const {
    verificationSuccess,
    isVerificationError: isVerificationErrorFromRedux,
    verificationMessage,
  } = useSelector((state) => state.Auth);

  // Parse URL parameters and auto-verify
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    if (emailParam && tokenParam) {
      dispatch(
        verifyEmailThunk({
          email: emailParam,
          verification_code: tokenParam,
        })
      )
        .unwrap()
        .then(() => {
          setVerifying(false);
          setIsVerificationError(false);
          toast.success("Email verified successfully!", {
            position: "top-center",
            icon: <CheckCircle className="text-green-500" size={20} />,
            description: "You can now log in to your account.",
          });
          setTimeout(() => {
            if (onClose) {
              onClose();
            } else {
              navigate("/login");
            }
          }, 2000);
        })
        .catch((error) => {
          setVerifying(false);
          setIsVerificationError(true);
          toast.error(error.message || "Verification failed. Please try again.", {
            position: "top-center",
            icon: <TriangleAlert className="text-red-500" size={20} />,
          });
        });
    } else {
      setVerifying(false);
      setIsVerificationError(true);
    }
  }, [location.search, dispatch, navigate, onClose]);

  const handleResend = async () => {
    const emailToUse = userEmail || inputEmail;
    console.log("[VerifyEmail] handleResend called with email:", emailToUse);
    setResending(true);
    setResentMessage("");
    setResentError("");
    if (!emailToUse) {
      setResending(false);
      setResentError("Please enter your email address.");
      return;
    }
    try {
      const resultAction = await dispatch(resendVerificationEmailThunk(emailToUse));
      if (resendVerificationEmailThunk.fulfilled.match(resultAction)) {
        setResentMessage(resultAction.payload);
      } else {
        setResentError(resultAction.payload || "Failed to resend verification link.");
      }
    } catch (err) {
      setResentError("Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-white"
          >
            <X size={24} className="text-white" />
          </button>
        )}

        <div className="mb-4 md:mb-6 text-center">
          <img
            src="/src/assets/logo.png"
            alt="Turtle Conservation Society"
            className="h-10 md:h-16 mx-auto mb-2"
          />
          <h1 className="text-2xl md:text-3xl font-serif text-[#666639] mb-2">
            Verify Your Email
          </h1>
        </div>

        {verifying && (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" className="text-[#666639]" />
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {!verifying && isVerificationError && (
          <Alert color="failure" className="mb-4 flex flex-col items-center text-center">
            <div className="mb-4 text-base text-[#4D6A4D] font-medium">We sent you a verification link when you signed up.</div>
            <div className="mt-2 flex flex-col items-center w-full">
              <label className="block text-base font-semibold text-[#4D6A4D] mb-2" htmlFor="resend-email-input">
                Didn’t get the email?
              </label>
              <div className="flex w-full gap-2 flex-col sm:flex-row justify-center items-center">
                <input
                  id="resend-email-input"
                  type="email"
                  value={userEmail || inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4D6A4D] transition text-center"
                  disabled={!!userEmail}
                  autoComplete="email"
                />
                <button
                  onClick={handleResend}
                  className={`px-4 py-2 rounded bg-[#4D6A4D] text-white font-medium transition-colors ${resending || !(userEmail || inputEmail) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#666639]'}`}
                  disabled={resending || !(userEmail || inputEmail)}
                >
                  {resending ? "Resending..." : "Resend link"}
                </button>
              </div>
              {resentMessage && (
                <div className="mt-2 text-green-600 text-sm">{resentMessage}</div>
              )}
              {resentError && (
                <div className="mt-2 text-red-600 text-sm">{resentError}</div>
              )}
            </div>
            <Button
              color="gray"
              onClick={() => (onClose ? onClose() : navigate("/login"))}
              className="w-full mt-4 bg-[#4D6A4D] hover:bg-[#666639] text-white rounded-lg transition-colors py-2"
            >
              {onClose ? "Close" : "Go to Login"}
            </Button>
          </Alert>
        )}

        {!verifying && verificationSuccess && (
          <Alert color="success" className="mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Success!</span>
            </div>
            <p>
              Your email has been verified successfully. You can now login to
              your account.
            </p>
            <Button
              color="gray"
              onClick={() => (onClose ? onClose() : navigate("/login"))}
              className="w-full mt-4 bg-[#4D6A4D] hover:bg-[#666639] text-white rounded-lg transition-colors py-2"
            >
              {onClose ? "Close" : "Go to Login"}
            </Button>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
