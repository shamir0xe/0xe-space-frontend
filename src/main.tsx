import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "@/components/Home";
import Blog from "@/components/pages/Blog";
import { AuthProvider } from "./components/AuthContext.tsx";
import { CursorProvider } from "./components/CursorContext.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CursorProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </CursorProvider>
        <Routes>
          <Route path="/blog/" element={<Blog />} />
        </Routes>
        {/* <Route path="/result/:modelId" element={<Result />} /> */}
        {/* <Route path="/management/" element={<Management />} /> */}
        {/* <Route path="/management/" element={<Management />} /> */}
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
