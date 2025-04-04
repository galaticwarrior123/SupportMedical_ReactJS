import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    isAppointmentListModalOpen: false,
    selectedDate: null,
    selectedPatient: null,
}

const doctorScheduleSlice = createSlice({
    name: "doctorSchedule",
    initialState: INITIAL_STATE,
    reducers: {
        openAppointmentListModal: (state, action) => {
            state.isAppointmentListModalOpen = true;
            state.selectedDate = action.payload;
            state.selectedPatient = null; // Reset selected patient when opening the modal
        },
        closeAppointmentListModal: (state) => {
            state.isAppointmentListModalOpen = false;
        },
        setSelectedPatient: (state, action) => {
            state.selectedPatient = action.payload;
        },
    }
});

export const { openAppointmentListModal, closeAppointmentListModal, setSelectedPatient} = doctorScheduleSlice.actions;

export default doctorScheduleSlice.reducer;