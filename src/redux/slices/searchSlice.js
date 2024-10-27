import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserAPI } from "../../API/UserAPI";
import PostAPI from "../../API/PostAPI";

const INITIAL_STATE = {
    postResults: [],
    userResults: [],
    activeTab: "posts",
    searchQuery: "",
    postFilter: {
        tagId: "",
    },
    userFilter: {
        isDoctor: false,
    }
};

export const searchPosts = createAsyncThunk(
    "search/searchPosts",
    async (filter) => {
        const response = await PostAPI.searchPost(filter);
        return response.data;
    }
);

export const searchUsers = createAsyncThunk(
    "search/searchUsers",
    async (filter) => {
        const response = await UserAPI.searchUserByFilter(filter);
        return response.data;
    }
);

export const performSearch = createAsyncThunk(
    "search/performSearch",
    async (_, { getState, dispatch }) => {
        const state = getState().search;
        const filter = { searchQuery: state.searchQuery };
        if (state.activeTab === "posts") {
            await dispatch(searchPosts({ ...filter, ...state.postFilter }));
        } else {
            await dispatch(searchUsers({ ...filter, ...state.userFilter }));
        }
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState: INITIAL_STATE,
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setPostFilter: (state, action) => {
            state.postFilter = action.payload;
        },
        setUserFilter: (state, action) => {
            state.userFilter = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(searchPosts.fulfilled, (state, action) => {
            state.postResults = action.payload;
        });
        builder.addCase(searchUsers.fulfilled, (state, action) => {
            state.userResults = action.payload;
        });
    }
});

export const { setActiveTab, setSearchQuery, setPostFilter, setUserFilter } = searchSlice.actions;

export default searchSlice.reducer;