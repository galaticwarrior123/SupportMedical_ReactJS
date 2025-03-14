import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import searchReducer from "./slices/searchSlice";
import chatReducer from "./slices/chatSlice";

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        search: searchReducer,
        chat: chatReducer,
    },
});