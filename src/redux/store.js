import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import searchReducer from "./slices/searchSlice";
import chatReducer from "./slices/chatSlice";
import doctorDashboardReducer from "./slices/doctorDashboardSlice";
import doctorScheduleReducer from "./slices/doctorScheduleSlice";

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        search: searchReducer,
        chat: chatReducer,
        doctorDashboard: doctorDashboardReducer,
        doctorSchedule: doctorScheduleReducer
    },
});