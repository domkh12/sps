import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import {Typography} from "@mui/material";
import ModalUtilSearchComponent from "./ModalUtilSearchComponent.jsx";
import {setIsOpenUtilSearch} from "../redux/feature/actions/actionSlice.js";
import {useDispatch, useSelector} from "react-redux";

function UtilSearchComponent() {
    const dispatch = useDispatch();
    return (
        <>
            <button
                onClick={() => dispatch(setIsOpenUtilSearch(true))}
                className="hidden bg-opacity-5 hover:bg-opacity-10 w-[100px] h-[40px] rounded-xl gap-2 xl:flex justify-evenly items-center px-[7px] mr-[8px] shadow-inner">
                <SearchTwoToneIcon className="w-5 h-5 text-opacity-20"/>
                <div className="bg-white px-[7px] py-[2px] rounded-lg shadow-sm text-black">
                    <Typography variant="body1">
                        ⌘ K
                    </Typography>
                </div>
            </button>
            <ModalUtilSearchComponent/>
        </>
    )
}

export default UtilSearchComponent;