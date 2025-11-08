import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import StoreProvider from "./redux/StoreProvider.jsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
      <div className="w-full min-h-screen overflow-x-hidden">
        <Toaster />
        <App />
      </div>
    </StoreProvider>
  </React.StrictMode>
);
