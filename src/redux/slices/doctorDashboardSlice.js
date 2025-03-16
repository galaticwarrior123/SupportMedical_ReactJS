import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    isRecordResultModalOpen: false,
}

const doctorDashboardSlice = createSlice({
    name: "doctorDashboard",
    initialState: INITIAL_STATE,
    reducers: {
        openRecordResultModal: (state) => {
            state.isRecordResultModalOpen = true;
        },
        closeRecordResultModal: (state) => {
            state.isRecordResultModalOpen = false;
        },
    }
});

export const { openRecordResultModal, closeRecordResultModal } = doctorDashboardSlice.actions;

export default doctorDashboardSlice.reducer;