import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { listStyle } from "../assets/style";
import {
  fetchTranslations,
  setLanguage,
} from "../redux/feature/translate/translationSlice";
import SnackBarComponent from "./SnackBarComponent";
import useTranslate from "./../hook/useTranslate";
import { toast, Slide } from "react-toastify";

function TranslateComponent() {
  const { language, loading, isSuccess } = useSelector(
    (state) => state.translation
  );
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [initialFetchDone, setInitialFetchDone] = useState(true);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslate();

  useEffect(() => {
    if (initialFetchDone) {
        dispatch(fetchTranslations(language));
        setInitialFetchDone(false);
    } else {
        toast.success(t("changeLanguage"), {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Slide
        });
    }
}, [language]);

  
  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
    dispatch(fetchTranslations(lang));
  };

  const flagImage =
    language === "kh" ? "/images/khmer_flag.png" : "/images/english_flag.png";

  return (
    <>
      <PopupState variant="popover" popupId="more-action-popover">
        {(popupState) => (
          <div>
            <IconButton
              aria-label="more_menu"
              {...bindTrigger(popupState)}
              size="large"
              sx={{ width: "44px", height: "44px" }}
              className="active-scale hover-scale"
            >
              <div className="absolute w-8 h-6 overflow-hidden rounded-md flex justify-center">
                <img src={flagImage} alt="flag" className="object-fill" />
              </div>
            </IconButton>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <List
                component="div"
                disablePadding
                dense={true}
                sx={{
                  ...listStyle,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    handleLanguageChange("kh");
                    popupState.close();
                  }}
                  sx={{
                    borderRadius: "6px",
                  }}
                >
                  <ListItemText
                    primary={
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-6 overflow-hidden rounded-md flex justify-center">
                          <img
                            src="/images/khmer_flag.png"
                            alt="flag"
                            className="object-fill"
                          />
                        </div>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            display: "inline",
                          }}
                        >
                          ភាសាខ្មែរ
                        </Typography>
                      </div>
                    }
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    handleLanguageChange("en");
                    popupState.close();
                  }}
                  sx={{
                    borderRadius: "6px",
                  }}
                >
                  <ListItemText
                    primary={
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-6 overflow-hidden rounded-md flex justify-center">
                          <img
                            src="/images/english_flag.png"
                            alt="flag"
                            className="object-fill"
                          />
                        </div>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            display: "inline",
                          }}
                        >
                          English
                        </Typography>
                      </div>
                    }
                  />
                </ListItemButton>
              </List>
            </Popover>
          </div>
        )}
      </PopupState>

      <SnackBarComponent
        isLoading={loading}
        caption={caption}
        isOpen={openSnackBar}
        onClose={() => setOpenSnackBar(false)}
      />
    </>
  );
}

export default TranslateComponent;
