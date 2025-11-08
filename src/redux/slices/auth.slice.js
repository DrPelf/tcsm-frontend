import { createSlice } from "@reduxjs/toolkit";
import { 
  login, 
  registerThunk, 
  verifyEmailThunk, 
  sendForgotPasswordEmailThunk, 
  verifyForgotPasswordTokenThunk,
  resetPasswordThunk 
} from "../thunks/auth.thunk";

const initialState = {
  token: localStorage.getItem("token") || null,
  refresh_token: null,
  userData: null,
  isAuthenticated: false,
  loadingLogin: false,
  isLoginError: null,
  loginMessage: "",

  loadingResetToken: false,
  loadingRefreshToken: false,
  loadingRegister: false,
  loadingVerification: false,

  isRegistrationError: false,
  isVerificationError: false,
  isRequestResetTokenError: false,

  resetTokenMessage: "",
  verificationMessage: "",
  registerMessage: "",

  isVerified: false,
  verificationSuccess: false,
  registrationSuccess: false,

  lastAttemptedEmail: '',
  
  isPasswordUpdatePending: false,
  passwordUpdateError: null,

  // Password reset states
  isResetRequestError: false,
  resetRequestMessage: "",
  isResetRequestLoading: false,
  
  isVerifyTokenError: false,
  verifyTokenMessage: "",
  isVerifyTokenLoading: false,
  
  isResetPasswordError: false,
  resetPasswordMessage: "",
  isResetPasswordLoading: false,

  pendingVerificationEmail: null,
};
  
const AuthenticationSlice = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        handleLogout(state, action) { 
            return { ...initialState };
        },
        resetRegistrationSuccess(state) {
            state.registrationSuccess = false;
            state.registerMessage = "";
        },
        resetVerificationSuccess(state) {
            state.verificationSuccess = false;
            state.verificationMessage = "";
        },
        setPendingVerificationEmail: (state, action) => {
            state.pendingVerificationEmail = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        // Login reducers
        .addCase(login.pending, (state) => {
            state.loadingLogin = true;
            state.isLoginError = null;
            state.isAuthenticated = false;
        })
        .addCase(login.rejected, (state, action) => {
            state.loadingLogin = false;
            state.isLoginError = true;
            state.isAuthenticated = false;
            state.loginMessage = action.payload?.message;
            if (action.payload?.email) {
                state.lastAttemptedEmail = action.payload.email;
            }
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loadingLogin = false;
            state.loginMessage = "Login successful";
            state.isLoginError = false;
            state.isAuthenticated = true;

            // Store user data and tokens
            state.userData = action.payload.user;
            state.token = action.payload.token; 
            state.refresh_token = action.payload.refresh_token;

            // Save tokens to localStorage
            localStorage.setItem("token", action.payload.token); 
            localStorage.setItem("refresh_token", action.payload.refresh_token); 

        })
        // Registration reducers
        .addCase(registerThunk.pending, (state) => {
            state.loadingRegister = true;
            state.isRegistrationError = false;
            state.registerMessage = "";
            state.registrationSuccess = false;
        })
        .addCase(registerThunk.rejected, (state, action) => {
            state.loadingRegister = false;
            state.isRegistrationError = true;
            state.registerMessage = action.payload?.message || "Registration failed";
        })
        .addCase(registerThunk.fulfilled, (state, action) => {
            state.loadingRegister = false;
            state.isRegistrationError = false;
            state.registerMessage = "Registration successful";
            state.userData = action.payload;
            state.registrationSuccess = true;
        })
        // Email verification reducers
        .addCase(verifyEmailThunk.pending, (state) => {
            state.loadingVerification = true;
            state.isVerificationError = false;
            state.verificationMessage = "";
            state.verificationSuccess = false;
        })
        .addCase(verifyEmailThunk.rejected, (state, action) => {
            state.loadingVerification = false;
            state.isVerificationError = true;
            state.verificationMessage = action.payload?.message || "Verification failed";
            state.verificationSuccess = false;
        })
        .addCase(verifyEmailThunk.fulfilled, (state, action) => {
            state.loadingVerification = false;
            state.isVerificationError = false;
            state.verificationMessage = "Email verified successfully";
            state.verificationSuccess = true;
            state.isVerified = true;
            if (action.payload) {
                state.userData = { ...state.userData, ...action.payload };
            }
        })
        // Forgot password request reducers
        .addCase(sendForgotPasswordEmailThunk.pending, (state) => {
            state.isResetRequestLoading = true;
            state.isResetRequestError = false;
            state.resetRequestMessage = "";
        })
        .addCase(sendForgotPasswordEmailThunk.rejected, (state, action) => {
            state.isResetRequestLoading = false;
            state.isResetRequestError = true;
            state.resetRequestMessage = action.payload?.message || "Failed to send reset code";
        })
        .addCase(sendForgotPasswordEmailThunk.fulfilled, (state) => {
            state.isResetRequestLoading = false;
            state.isResetRequestError = false;
            state.resetRequestMessage = "Reset code sent successfully";
        })
        // Verify reset code reducers
        .addCase(verifyForgotPasswordTokenThunk.pending, (state) => {
            state.isVerifyTokenLoading = true;
            state.isVerifyTokenError = false;
            state.verifyTokenMessage = "";
        })
        .addCase(verifyForgotPasswordTokenThunk.rejected, (state, action) => {
            state.isVerifyTokenLoading = false;
            state.isVerifyTokenError = true;
            state.verifyTokenMessage = action.payload?.message || "Invalid reset code";
        })
        .addCase(verifyForgotPasswordTokenThunk.fulfilled, (state) => {
            state.isVerifyTokenLoading = false;
            state.isVerifyTokenError = false;
            state.verifyTokenMessage = "Reset code verified successfully";
        })
        // Reset password reducers
        .addCase(resetPasswordThunk.pending, (state) => {
            state.isResetPasswordLoading = true;
            state.isResetPasswordError = false;
            state.resetPasswordMessage = "";
        })
        .addCase(resetPasswordThunk.rejected, (state, action) => {
            state.isResetPasswordLoading = false;
            state.isResetPasswordError = true;
            state.resetPasswordMessage = action.payload?.message || "Password reset failed";
        })
        .addCase(resetPasswordThunk.fulfilled, (state) => {
            state.isResetPasswordLoading = false;
            state.isResetPasswordError = false;
            state.resetPasswordMessage = "Password reset successfully";
        });
    }
});

export const { handleLogout, resetRegistrationSuccess, resetVerificationSuccess, setPendingVerificationEmail } = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;

