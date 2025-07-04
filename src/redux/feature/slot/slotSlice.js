import { createSlice } from "@reduxjs/toolkit";

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
        parkingSlotToEdit:{},
        slotToEdit:{},
        searchSlotToEdit:{},
        slotFilter:[],
        localSlotData:[],
        slotUpdateLocalData: [],
        isOpenAddNewSlot:false,
        idParkingSlotToDelete:"",
        searchParkingSlot: "",
        branchFilter: [],
    },
    reducers :{
        setParkingSlotToEdit:(state,action)=>{
            state.parkingSlotToEdit = action.payload;
        },
        setBranchFilterForSlot:(state,action)=>{
            state.branchFilter = action.payload;
        },
        setSearchParkingSlot:(state,action)=>{
            state.searchParkingSlot = action.payload;
        },
        setIdParkingSlotToDelete:(state,action)=>{
            state.idParkingSlotToDelete = action.payload;
        },
        appendSlotLocalData(state, action) {
            state.slotUpdateLocalData = action.payload
        },
        clearLocalSlotData:(state)=>{
            state.localSlotData=[];
            state.slotUpdateLocalData = [];
        },
        setNewLocalSlotData:(state, action) => {
          state.localSlotData = action.payload;
        },
        setIsOpenAddNewSlot:(state,action)=>{
            state.isOpenAddNewSlot=action.payload;
        },
        setLocalSlotData:(state,action)=>{
            state.localSlotData = [...state.localSlotData, action.payload];
            state.slotUpdateLocalData = [...state.slotUpdateLocalData, action.payload];
        },
        setSlot:(state,action)=>{
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
    setParkingSlotToEdit,
    setBranchFilterForSlot,
    setSearchParkingSlot,
    setIdParkingSlotToDelete,
    appendSlotLocalData,
    clearLocalSlotData,
    setNewLocalSlotData,
    setIsOpenAddNewSlot,
    setLocalSlotData,
    setSlot,
    setPageSize,
    setTotalPages,
    setIdSlotToDelete,
    setIsOpenQuickEditSlot,
    setSlotToEdit,
    setSearchSlotToEdit,
    setSlotFilter,

}=slotSlice.actions;
export default slotSlice.reducer;