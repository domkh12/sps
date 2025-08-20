import {useDispatch, useSelector} from "react-redux";
import {Modal, Typography, Box, IconButton, LinearProgress} from "@mui/material";
import {setIsOpenPdfModal} from "../redux/feature/actions/actionSlice.js";
import useTranslate from "../hook/useTranslate.jsx";
import {CloseSharp} from "@mui/icons-material";

function PdfModalPreviewComponent({pdfUrl, isLoading, isSuccess}) {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.action.isOpenPdfModal);
    const {t} = useTranslate();

    return (
        <Modal
            open={isOpen}
            onClose={() => dispatch(setIsOpenPdfModal(false))}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                <Box
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: "16px",
                        width: "95%",
                        maxWidth: "90%",
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        overflow: "auto",
                        height: "90vh",
                        boxShadow: "0px 10px 15px -3px rgb(0 0 0 / 20%), 0px 4px 6px -2px rgb(0 0 0 / 15%)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div className="flex justify-between items-center pr-3 relative">
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{padding: "24px"}}
                        >
                            {t('reportUser')}
                        </Typography>
                        <IconButton onClick={() => dispatch(setIsOpenPdfModal(false))}>
                            <CloseSharp/>
                        </IconButton>
                        {
                            isLoading && (
                                <div className="w-full absolute bottom-0 left-0">
                                    <LinearProgress/>
                                </div>
                            )
                        }

                    </div>
                    <Box sx={{height:"100%"}}>
                        {(pdfUrl && isSuccess) && (
                            <iframe
                                key={pdfUrl}
                                src={pdfUrl}
                                style={{ width: "100%", height: "100%" }}
                                title="PDF Preview"
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export default PdfModalPreviewComponent;