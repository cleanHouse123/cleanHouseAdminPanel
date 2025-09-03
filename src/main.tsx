import { TooltipProvider } from "@/core/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./app/App";
import { ThemeProvider } from "./core/feauture/theme/theme-provider";
import "./core/i18n";
import i18n from "./core/i18n";
import "./index.css";
import queryClient from "./core/config/query";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </TooltipProvider>
  </React.StrictMode>
);
