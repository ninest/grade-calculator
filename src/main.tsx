import { GPACalculatorRoute } from "@/routes/gpa-calculator/route.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GPACalculatorRoute />
  </React.StrictMode>
);
