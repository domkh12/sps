import "./config/init.js";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {Provider} from "react-redux";
import store from "./redux/app/store.js";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "./config/config.js"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
            }}
        >
            <HelmetProvider>
                <Provider store={store}>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <App/>
                    </LocalizationProvider>
                </Provider>
            </HelmetProvider>
        </BrowserRouter>
    </StrictMode>
);
