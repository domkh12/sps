import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton, Modal,
  Paper,
  Popover,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
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
import useTranslate from "../hook/useTranslate";
import {Slide, toast} from "react-toastify";
import OTPInput from "react-otp-input";

function TwoFaVerifyComponent() {
  const [otp, setOtp] = useState('');
  const [copied, setCopied] = useState(false);
  const qrCodeUrl = useSelector(selectQrCodeUrl);
  const dispatch = useDispatch();
  const twoFASecretCode = useSelector(selectTwoFASecretCode);
  const isOpeningPopOverForm = useSelector(
    (state) => state.auth.isOpenTwoFaPopOver
  );
  const { t } = useTranslate();
  const [
    get2faSecretCode,
    {
      isLoading: isGet2faSecretCodeLoading,
      isSuccess: isGet2faSecretCodeSuccess,
    },
  ] = useGet2faSecretCodeMutation();

  const [getQrCode2Fa, {}] = useGetQrCode2FaMutation();

  const [
    verifyTwoFa,
    {
      isSuccess: isVerifyTwoFaSuccess,
      isLoading: isVerifyTwoFaLoading,
      isError: isVerifyTwoFaError,
      error: verifyTwoFaError,
    },
  ] = useVerifyTwoFaMutation();

  useEffect(() => {
    if (isVerifyTwoFaSuccess) {
      toast.success(t("verifySuccess"), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
      dispatch(setIsOpenTwoFaPopOver(false));
    }
  }, [isVerifyTwoFaSuccess]);

  useEffect(() => {
    if (isVerifyTwoFaError) {
      toast.error(`${verifyTwoFaError?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isVerifyTwoFaError]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = [];

        promises.push(get2faSecretCode());
        promises.push(getQrCode2Fa());

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

  }, [setIsOpenTwoFaPopOver]);

  const handleClose = () => {
    dispatch(setIsOpenTwoFaPopOver(false));
    setOtp('');
  };

  useEffect(() => {
    if (otp.length === 6) {
      verifyTwoFa({
        code: otp
      })
    }
  }, [otp])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(twoFASecretCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <Modal
          open={isOpeningPopOverForm}
          onClose={handleClose}
          aria-labelledby="two-factor-authentication-modal"
          aria-describedby="two-factor-authentication-description"
      >
        <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '38rem',
              maxWidth: '90vw',
              bgcolor: 'background.paper',
              borderRadius: '20px',
              boxShadow: 24,
              outline: 'none',
            }}
        >
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
                    {isGet2faSecretCodeLoading ? (
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
                <div className="flex justify-center">
                  {/*<OTPInput*/}
                  {/*    value={otp}*/}
                  {/*    onChange={setOtp}*/}
                  {/*    numInputs={6}*/}
                  {/*    renderSeparator={<span>-</span>}*/}
                  {/*    // onPaste={handlePaste}*/}
                  {/*    inputType="tel"*/}
                  {/*    renderInput={(props) => <input {...props} />}*/}
                  {/*    inputStyle={{*/}
                  {/*      width: "2.5rem",*/}
                  {/*      height: "2.5rem",*/}
                  {/*      margin: "0 0.5rem",*/}
                  {/*      fontSize: "1.5rem",*/}
                  {/*      borderRadius: 4,*/}
                  {/*      border: "1px solid #ccc",*/}
                  {/*      // color: mode === "dark" ? "white" : "black",*/}
                  {/*      // backgroundColor: mode === "dark" ? "black" : "white"*/}
                  {/*    }}*/}
                  {/*/>*/}
                  <OTPInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span className="hidden sm:inline mx-1 text-gray-400">-</span>} // Hide separators on mobile
                      inputType="tel"
                      renderInput={(props) => <input {...props} />}
                      containerStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        maxWidth: '100%',
                        overflow: 'hidden'
                      }}
                      inputStyle={{
                        width: 'min(12vw, 2.5rem)', // More aggressive responsive sizing
                        height: 'min(12vw, 2.5rem)',
                        fontSize: 'min(4vw, 1.5rem)',
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        textAlign: 'center',
                        margin: 0
                      }}
                  />
                </div>
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
      </Modal>
    </>
  );
}

export default TwoFaVerifyComponent;
