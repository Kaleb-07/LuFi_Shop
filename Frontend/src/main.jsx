import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider from "./utils/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
      gcTime: 1000 * 60 * 30,    // Keep data in cache for 30 minutes
      retry: 1,                 // Only retry once on failure
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
);
