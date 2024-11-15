import "./config/init.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/app/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import AuthProvider from "./pages/auth/useAuthProvider";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      'Hanuman',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <HelmetProvider>
        <Provider store={store}>
          <ToastContainer stacked />
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <App />
              </ThemeProvider>
          </AuthProvider>
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
