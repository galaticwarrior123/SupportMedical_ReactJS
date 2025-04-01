import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ResultRegistrationAPI } from "../../API/ResultRegistrationAPI";
import { ResultRegistrationStatus } from "../../Common/Constants";
import { toast } from "react-toastify";

const INITIAL_STATE = {
    isRecordResultModalOpen: false,
    selectedPatient: null,
    appointments: [],
}

export const fetchResultRegistrations = createAsyncThunk(
    "doctorDashboard/fetchResultRegistrations",
    async () => {
        const response = await ResultRegistrationAPI.doctorGetByFilter({
            status: ResultRegistrationStatus.PENDING,
        });
        return response.data;
    }
);

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchResultRegistrations.fulfilled, (state, action) => {
                state.appointments = action.payload;
                state.selectedPatient = null;// reset selected patient when fetching new data
            })
            .addCase(fetchResultRegistrations.rejected, (state, action) => {
                toast.error("Lấy danh sách cuộc hẹn thất bại");
                console.error("Failed to fetch result registrations:", action.error);
            });
    },
});

export const { openRecordResultModal, closeRecordResultModal, setSelectedPatient } = doctorDashboardSlice.actions;

export default doctorDashboardSlice.reducer;