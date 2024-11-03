import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChatAPI } from "../../API/ChatAPI";


const INITIAL_STATE = {
    unreadChatCount: 0,
};

export const markChatAsRead = createAsyncThunk(
    "chat/markChatAsRead",
    async (chatId, thunkAPI) => {
        const dispatch = thunkAPI.dispatch;
        await ChatAPI.markChatAsRead(chatId);
        dispatch(getUnreadCount());
    }
);

export const getUnreadCount = createAsyncThunk(
    "chat/getUnreadCount",
    async () => {
        const response = await ChatAPI.getUnreadCount();
        console.log('getUnreadCount', response.data);
        return response.data;
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {
        builder.addCase(getUnreadCount.fulfilled, (state, action) => {
            state.unreadChatCount = action.payload;
        });
        builder.addCase(markChatAsRead.fulfilled, (state, action) => {
            state.unreadChatCount = action.payload;
        });
        
    }
});

export default chatSlice.reducer;