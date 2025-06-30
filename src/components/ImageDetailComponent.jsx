import { useState } from "react";
import { Typography, Modal, Box, IconButton } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

function ImageDetailComponent({ name, image }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="flex items-center gap-5">
                <div
                    className="relative p-1 border-dashed border rounded-[12px] cursor-pointer group hover:shadow-lg transition"
                    onClick={handleOpen}
                >
                    <div className="w-48 h-28 rounded-[12px] overflow-hidden">
                        <img
                            src={image || "/images/img_placeholder.png"}
                            alt="roomImage"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Hover Icon Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-[12px]">
                        <AiOutlineEye className="text-white text-3xl" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Typography variant="body1">{name}</Typography>
                </div>
            </div>

            {/* Modal Preview */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        outline: "none",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.3)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                        }}
                    >
                        <IoClose size={24} />
                    </IconButton>
                    <img
                        src={image || "/images/img_placeholder.png"}
                        alt="Preview"
                        style={{
                            maxHeight: "80vh",
                            maxWidth: "80vw",
                            borderRadius: "12px",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
}

export default ImageDetailComponent;
