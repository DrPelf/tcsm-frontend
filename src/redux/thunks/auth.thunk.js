import { createAsyncThunk } from "@reduxjs/toolkit";
import { setPendingVerificationEmail } from "../slices/auth.slice";

const apiUrl = "https://api.turtleconservation.site/";

export const login = createAsyncThunk(
  "auth-login",
  async (params, thunkAPI) => {
    const abortController = new AbortController();

    const url = `${apiUrl}auth/login`;
    const paramsObj = {
      email: params.email,
      password: params.password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramsObj),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const respObj = await response.json();
        if (response.status === 401 && respObj.message === "User account not verified." && respObj.email) {
          thunkAPI.dispatch(setPendingVerificationEmail(respObj.email));
        }
        return thunkAPI.rejectWithValue({
          status: response.status,
          message: respObj.message || "An error occurred",
          email: respObj.email || params.email,
        });
      }

      const respData = await response.json();

      return {
        token: respData.data.access_token, 
        refresh_token: respData.data.refresh_token, 
        user: {
          id: respData.data.id,
          email: respData.data.email,
          name: respData.data.name,
          role: respData.data.role,
        },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: 500,
        message: error.message || "An unexpected error occurred",
        email: params.email,
      });
    } finally {
      abortController.abort();
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth-register",
  async (params, thunkAPI) => {
    const abortController = new AbortController();

    const url = `${apiUrl}auth/register`;

    const requestBody = {
      ...params
    };

    const body = JSON.stringify(requestBody);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        signal: abortController.signal,
      });

      if (!response.ok) {
        const respObj = await response.json();
        abortController.abort();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data;
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue({ error: "Request failed" });
    }
  }
);

//API is at /auth/verify-email
export const verifyEmailThunk = createAsyncThunk(
  "auth-verify-email",
  async (params, thunkAPI) => {
    const abortController = new AbortController();

    const url = `${apiUrl}auth/verify-email`;

    const requestBody = {
      jwt_token: params.jwt_token
    };

    const body = JSON.stringify(requestBody);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        signal: abortController.signal,
      });

      if (!response.ok) {
        const respObj = await response.json();
        abortController.abort();
        return thunkAPI.rejectWithValue(respObj);
      }

      const respData = await response.json();
      return respData.data;
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue({ error: "Request failed" });
    }
  }
);

export const sendForgotPasswordEmailThunk = createAsyncThunk(
  "auth-send-forgot-password-email",
  async (params, thunkAPI) => {
    const abortController = new AbortController();
    
    const url = `${apiUrl}auth/request-forgot-password-token`;
    
    const requestBody = {
      email: params.email
    };
    
    const body = JSON.stringify(requestBody);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        const respObj = await response.json();
        abortController.abort();
        return thunkAPI.rejectWithValue(respObj);
      }
      
      const respData = await response.json();
      return respData.data;
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue({ error: "Request failed" });
    }
  }
);


export const verifyForgotPasswordTokenThunk = createAsyncThunk(
  "auth-verify-forgot-password-token",
  async (params, thunkAPI) => {
    const abortController = new AbortController();
    
    const url = `${apiUrl}auth/verify-reset-code`;
    
    const requestBody = {
      email: params.email,
      reset_code: params.reset_code
    };
    
    const body = JSON.stringify(requestBody);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        const respObj = await response.json();
        abortController.abort();
        return thunkAPI.rejectWithValue(respObj);
      }
      
      const respData = await response.json();
      return respData.data;
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue({ error: "Request failed" });
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth-reset-password",
  async (params, thunkAPI) => {
    const abortController = new AbortController();
    
    const url = `${apiUrl}auth/reset-password`;
    
    const requestBody = {
      email: params.email,
      reset_code: params.reset_code,
      new_password: params.new_password
    };
    
    const body = JSON.stringify(requestBody);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        const respObj = await response.json();
        abortController.abort();
        return thunkAPI.rejectWithValue(respObj);
      }
      
      const respData = await response.json();
      return respData.data;
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue({ error: "Request failed" });
    }
  }
);

export const resendVerificationEmailThunk = createAsyncThunk(
  "auth-resend-verification-email",
  async (email, thunkAPI) => {
    const abortController = new AbortController();
    const url = `${apiUrl}auth/resend-email?email=${encodeURIComponent(email)}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        signal: abortController.signal,
      });
      const data = await response.json();
      if (!response.ok || data.status === "error") {
        abortController.abort();
        return thunkAPI.rejectWithValue(data.message || "Failed to resend verification link.");
      }
      return data.message || "Verification link resent! Please check your email.";
    } catch (error) {
      abortController.abort();
      return thunkAPI.rejectWithValue(error.message || "Failed to resend verification link.");
    }
  }
);



