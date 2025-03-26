import { createSlice } from "@reduxjs/toolkit";


const INITIAL_STATE = {
    patientProfile: null,
}

const doctorPatientProfileSlice = createSlice({
    name: "doctorPatientProfile",
    initialState: INITIAL_STATE,
    reducers: {
        setPatientProfile: (state, action) => {
            state.patientProfile = action.payload;
        },
    }
});

export const { setPatientProfile } = doctorPatientProfileSlice.actions;

export default doctorPatientProfileSlice.reducer;
