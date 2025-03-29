import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    isRecordResultModalOpen: false,
    selectedPatient: null,
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
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
    }
});

export const { openRecordResultModal, closeRecordResultModal, setSelectedPatient} = doctorDashboardSlice.actions;

export default doctorDashboardSlice.reducer;