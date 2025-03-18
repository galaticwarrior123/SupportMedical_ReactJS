import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    isAppointmentListModalOpen: false,
}

const doctorScheduleSlice = createSlice({
    name: "doctorSchedule",
    initialState: INITIAL_STATE,
    reducers: {
        openAppointmentListModal: (state) => {
            state.isAppointmentListModalOpen = true;
        },
        closeAppointmentListModal: (state) => {
            state.isAppointmentListModalOpen = false;
        },
    }
});

export const { openAppointmentListModal, closeAppointmentListModal} = doctorScheduleSlice.actions;

export default doctorScheduleSlice.reducer;