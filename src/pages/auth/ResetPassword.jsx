import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk } from "@redux/thunks/auth.thunk";
import { toast } from "sonner";
import { TriangleAlert, CheckCircle, X, Lock } from "lucide-react";
import { Button, Spinner } from "flowbite-react";

const ResetPassword = ({ onClose, email, resetCode }) => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const { isResetPasswordLoading, isResetPasswordError, resetPasswordMessage } =
    useSelector((state) => state.Auth);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await dispatch(
        resetPasswordThunk({
          email,
          reset_code: resetCode,
          new_password: passwords.newPassword,
        })
      ).unwrap();

      toast.success("Password reset successfully!", {
        position: "top-center",
        icon: <CheckCircle className="text-green-500" size={20} />,
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Password reset failed. Please try again.", {
        position: "top-center",
        icon: <TriangleAlert className="text-red-500" size={20} />,
      });
      setError(error.message || "Failed to reset password. Please try again.");
    }
  };

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
            Reset Password
          </h1>
          <p className="text-gray-600">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-lg mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#666639]"
                required
                minLength={8}
                disabled={isResetPasswordLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-lg mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#666639]"
                required
                minLength={8}
                disabled={isResetPasswordLoading}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            color="gray"
            disabled={isResetPasswordLoading}
            className={`w-full flex items-center justify-center gap-2 ${
              isResetPasswordLoading
                ? "bg-gray-400"
                : "bg-[#666639] hover:bg-[#4D6A4D]"
            } text-white rounded-lg transition-colors py-2`}
          >
            {isResetPasswordLoading && (
              <Spinner size="sm" className="text-white" />
            )}
            {isResetPasswordLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
