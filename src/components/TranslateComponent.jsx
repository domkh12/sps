import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import React, { useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { listStyle } from "../assets/style";
import {
  fetchTranslations,
  setLanguage,
} from "../redux/feature/translate/translationSlice";

function TranslateComponent() {
  const currenLanguage = useSelector((state) => state.translation.language);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTranslations(currenLanguage));
  }, [currenLanguage]);

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const flagImage =
    currenLanguage === "kh"
      ? "/images/khmer_flag.png"
      : "/images/english_flag.png";

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
              slotProps={{
                paper: {
                  style: {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                },
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
                    color: "#424242",
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
                            color: "#424242",
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
                    color: "#424242",
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
                            color: "#424242",
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
    </>
  );
}

export default TranslateComponent;
