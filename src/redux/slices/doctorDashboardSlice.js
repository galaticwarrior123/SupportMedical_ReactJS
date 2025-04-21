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
            // startDate: new Date().toISOString().split("T")[0],
            // endDate: new Date().toISOString().split("T")[0],
        });
        const data = response.data;
        // sort by data.shiftSegment.startTime
        // time format: mm:ss
        data.sort((a, b) => {
            const aTime = a.shiftSegment.startTime.split(":").map(Number);
            const bTime = b.shiftSegment.startTime.split(":").map(Number);
            return aTime[0] - bTime[0] || aTime[1] - bTime[1];
        });
        return data;
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