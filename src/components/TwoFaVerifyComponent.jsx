import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PiCopyThin, PiXThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import {
  selectQrCodeUrl,
  selectTwoFASecretCode,
  setIsOpenTwoFaPopOver,
} from "../redux/feature/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGet2faSecretCodeMutation } from "../redux/feature/users/userApiSlice";
import {
  useGetQrCode2FaMutation,
  useVerifyTwoFaMutation,
} from "../redux/feature/auth/authApiSlice";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../redux/feature/actions/actionSlice";
import useTranslate from "../hook/useTranslate";
import OTPInput from "./OTPInput";

function TwoFaVerifyComponent({ onVerificationSuccess }) {
  const [copied, setCopied] = useState(false);
  const qrCodeUrl = useSelector(selectQrCodeUrl);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [shortUrl, setShortUrl] = useState("");
  const twoFASecretCode = useSelector(selectTwoFASecretCode);
  const isOpeningPoppOverForm = useSelector(
    (state) => state.auth.isOpenTwoFaPopOver
  );
  const { t } = useTranslate();
  const [
    get2faSecretCode,
    {
      isLoading: isget2faSecretCodeLoading,
      isSuccess: isget2faSecretCodeSuccess,
    },
  ] = useGet2faSecretCodeMutation();

  const [getQrCode2Fa, {}] = useGetQrCode2FaMutation();

  const [
    verifyTwoFa,
    {
      isSuccess: isVerifyTwoFaSuccess,
      isLoading: isVerifyTwoFaLoading,
      isError: isVerifyTwoFaError,
    },
  ] = useVerifyTwoFaMutation();

  useEffect(() => {
    if (isVerifyTwoFaSuccess) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
      dispatch(setIsOpenTwoFaPopOver(false));
       if (onVerificationSuccess) {
         onVerificationSuccess();
       }
    }
  }, [isVerifyTwoFaSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];

        promises.push(get2faSecretCode());
        promises.push(getQrCode2Fa());

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpeningPoppOverForm) {
      fetchData();
    }
  }, [isOpeningPoppOverForm]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleActivateBtnClick = async (otp) => {
    await verifyTwoFa(otp);
  };

  return (
    <>
      <Popover
        open={isOpeningPoppOverForm}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": {
            width: "38rem",
            height: "auto",
            borderRadius: "20px",
          },
        }}
      >
        <Box sx={{}}>
          <Typography variant="body2" component="div">
            <Typography
              sx={{
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Two-factor authentication
              <IconButton aria-label="close" onClick={()=> dispatch(setIsOpenTwoFaPopOver(false))}>
                <PiXThin />
              </IconButton>
            </Typography>
            <Divider />
            <div className="p-4 flex justify-center flex-col items-center">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="qrcode"
                  className="w-32 h-32"
                  loading="lazy"
                />
              ) : (
                <Skeleton
                  sx={{ bgcolor: "grey.500" }}
                  variant="rectangular"
                  width={118}
                  height={118}
                />
              )}

              <Typography
                variant="body2"
                component="div"
                className="grid gap-5 grid-cols-12"
                sx={{ mt: 2 }}
              >
                <div className="bg-gray-200 w-10 h-10 rounded-full col-span-1 flex justify-center items-center font-medium">
                  1
                </div>
                <p className="col-span-11">
                  Scan the QR code using any authentication application on your
                  phone. (e.g.
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en"
                    underline="always"
                    target="_blank"
                  >
                    {"Google Authenticator"}
                  </Link>
                  ,
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.duosecurity.duomobile&hl=en"
                    underline="always"
                    target="_blank"
                  >
                    {"Duo Mobile"}
                  </Link>
                  ,{" "}
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.duosecurity.duomobile&hl=en"
                    underline="always"
                    target="_blank"
                  >
                    {"Authy"}
                  </Link>
                  ) or enter the following code:
                </p>
              </Typography>
              {/* copy clipboard start */}
              <Typography component="div" className="w-full grid grid-cols-12">
                <div className="col-span-1"></div>
                <Paper
                  sx={{
                    height: "3rem",
                    width: "100%",
                    mt: 2,
                    borderRadius: "25px",
                  }}
                  elevation={2}
                  className="copy-box flex justify-between items-center col-span-11"
                >
                  <Box sx={{ p: "20px" }}>
                    {isget2faSecretCodeLoading ? (
                      <Skeleton
                        sx={{ bgcolor: "grey.500" }}
                        width={300}
                        height={30}
                      />
                    ) : (
                      <>{twoFASecretCode}</>
                    )}
                  </Box>
                  <Tooltip title={copied ? "Copied" : "Copy to clipboard"}>
                    <IconButton
                      onClick={handleCopy}
                      sx={{ minWidth: "30px", marginRight: "1rem" }}
                    >
                      <PiCopyThin className="h-7 w-7" />
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Typography>
              {/* copy clipboard start */}
              {/* code verify start */}
              <Typography
                variant="body2"
                component="div"
                className="grid gap-5 grid-cols-12 items-center"
                sx={{ mt: 2 }}
              >
                <div className="bg-gray-200 w-10 h-10 rounded-full col-span-1 flex justify-center items-center font-medium">
                  2
                </div>
                <p className="col-span-11">
                  Enter the 6 figure confirmation code shown on the app:
                </p>
              </Typography>
              <Typography
                component="div"
                className="grid grid-cols-12 w-full"
                sx={{ mt: 2 }}
              >
                <div className="col-span-1"></div>
                <div className="col-span-11">
                  <OTPInput length={6} onComplete={handleActivateBtnClick} />
                </div>
              </Typography>
              {/* code verify end */}
              {/* warning start */}
              <Typography component="div" sx={{ mt: 2 }} className="w-full">
                <Alert severity="warning">
                  You will logged out from all your devices and browsers that
                  have been used to log in to your account recently for security
                  reasons.
                </Alert>
              </Typography>
              {/* warning end */}
            </div>
            <Divider />
            <div className="flex justify-end items-center gap-2 p-4">
              <Button
                variant="outlined"
                onClick={() => dispatch(setIsOpenTwoFaPopOver(false))}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isVerifyTwoFaLoading}
                variant="contained"
              >
                Verify
              </LoadingButton>
            </div>
          </Typography>
        </Box>
      </Popover>
    </>
  );
}

export default TwoFaVerifyComponent;
