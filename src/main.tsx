import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";
import { CursorProvider } from "./components/CursorContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CursorProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CursorProvider>
  </StrictMode>,
);
