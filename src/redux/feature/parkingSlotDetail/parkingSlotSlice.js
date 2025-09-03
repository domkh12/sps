import {createSlice} from "@reduxjs/toolkit";

const parkingSlotDetailSlice = createSlice({
    name: "parkingSlotDetails",
    initialState: {
        pageNoReportParkingSlotDetail: 1,
        pageSizeReportParkingSlotDetail: 5,
        pageNoParkingDetail: 1,
        pageSizeParkingDetail: 5,
        keywords: "",
        dateFrom: "",
        dateTo: "",
        pageNoParkingReport: 1,
        pageSizeParkingReport: 5,
    },
    reducers: {
        setPageNoParkingReport(state, action) {
            state.pageNoParkingReport = action.payload;
        },
        setPageSizeParkingReport(state, action) {
            state.pageSizeParkingReport = action.payload;
        },
        setPageNoParkingDetail(state, action) {
            state.pageNoParkingDetail = action.payload;
        },
        setPageSizeParkingDetail(state, action) {
            state.pageSizeParkingDetail = action.payload;
        },
        setKeywordsParkingDetail(state, action) {
            state.keywords = action.payload;
        },
        setDateFromParkingDetail(state, action) {
            state.dateFrom = action.payload;
        },
        setDateToParkingDetail(state, action) {
            state.dateTo = action.payload;
        },
        setPageNoReportParkingSlotDetail(state, action) {
            state.pageNoReportParkingSlotDetail = action.payload;
        },
        setPageSizeReportParkingSlotDetail(state, action) {
            state.pageSizeReportParkingSlotDetail = action.payload;
        },
    },
});

export const {
    setPageNoParkingReport,
    setPageSizeParkingReport,
    setDateToParkingDetail,
    setDateFromParkingDetail,
    setKeywordsParkingDetail,
    setPageNoParkingDetail,
    setPageSizeParkingDetail,
    setPageNoReportParkingSlotDetail,
    setPageSizeReportParkingSlotDetail,
} = parkingSlotDetailSlice.actions;

export default parkingSlotDetailSlice.reducer;
