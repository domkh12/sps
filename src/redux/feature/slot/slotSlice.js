import { createSlice } from "@reduxjs/toolkit";
import { setIsOpenQuickEdit, setPageNo, setPageSize, setStatus, setTotalPages, setUuid } from "../users/userSlice";

const slotSlice= createSlice ({
    name:"slot",
    initialState:{
        uuid:"",
        status:"",
        pageNo:1,
        pageSize:5,
        totalPage:0,
        slot:{},
        idSlotToDelete:"",
        setIsOpenQuickEditSlot:false,
        slotToEdit:{},
        searchSlotToEdit:{},
        slotFilter:[],


    },
    reducers :{
        setslot:(state,action)=>{
            state.slot=action.payload;
        },
        setStatus:(state,action)=>{
            state.slot=action.payload;
        },
        setPageNo:(state,action)=>{
            state.pageNo=action.payload;
        },
        setPageSize:(state,action)=>{
            state.pageSize=action.payload;
        },
        setTotalPages:(state,action)=>{
            state.totalPage=action.payload;
        },
        setIdSlotToDelete:(state,action)=>{
            state.idSlotToDelete=action.payload;
        },
        setIsOpenQuickEditSlot:(state,action)=>{
            state.setIsOpenQuickEditSlot=action.payload;
        },
        setSlotToEdit:(state,action)=>{
            state.slotToEdit=action.payload;
        },
        setSearchSlotToEdit:(state,action)=>{
            state.setSearchSlotToEdit=action.payload;
        },
        setSlotFilter:(state,action)=>{
            state.slotFilter=action.payload;
        }
    }
})  
export const{
    setslot,
    setStatus,
    setPageNo,
    setPageSize,
    setTotalPages,
    setIdSlotToDelete,
    setIsOpenQuickEditSlot,
    setSlotToEdit,
    setSearchSlotToEdit,
    setSlotFilter,

}=slotSlice.actions;
export default slotSlice.reducer;