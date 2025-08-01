import {Button} from "@mui/material";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useLocalStorage from "../hook/useLocalStorage.jsx";
import useTranslate from "../hook/useTranslate.jsx";

function Error401Component() {
    const navigate = useNavigate();
    const {t} = useTranslate();
    const [authData, setAuthData] = useLocalStorage('authData', {
        isRemember: false,
        userRoles: "",
        uuid: null,
        roomId: null
    });

    useEffect(() => {
        setAuthData({
            isRemember: false,
            userRoles: "",
            uuid: null,
            roomId: null
        });
    }, []);
    return (
        <div className="flex justify-center items-center flex-col gap-5 h-screen">
            <img
                src="/images/error401.svg"
                alt="error401"
                className="max-w-[600px]"
            />
            <Button
                sx={{textTransform: "none", borderRadius: "6px", boxShadow: "none"}}
                variant="contained"
                onClick={() => navigate("/login")}
            >
                {t('goToLogin')}
            </Button>
        </div>
    );
}

export default Error401Component;
