import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        search: searchReducer,
    },
});