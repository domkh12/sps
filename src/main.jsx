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
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Roboto","Hanuman", "Arial", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      light: "#757ce8",
      main: "#2C3092",
      dark: '#000',
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#000",
      contrastText: "#000",
    },
    mode: "light",
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
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
