import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, endPoints } from "../../API/Api";



export interface INotification {
    _id: string;
    user: string;
    content: string;
    post: string;
}

export const getAllNotiAsyncThunk = createAsyncThunk("notification/getAll", async () => {
    const res = await authAPI().get(endPoints.getAllNotification)
    console.log(res.data)
    return res.data
})

export interface IInitialState {
    listNoti: INotification[];
    status: string;
}

const initialState:IInitialState = {
    listNoti: [],
    status: ''
}

export interface IReqBodyAddNoti {
    post: string;
    user: string;
    content: string;
    type: string;
}

export const addNotiCommentAsyncThunk = createAsyncThunk("notification/add", async (reqBodyAddNoti: IReqBodyAddNoti) => {
    const res = await authAPI().post(endPoints.addCommentNoti, {
        post: reqBodyAddNoti.post,
        user: reqBodyAddNoti.user,
        content: reqBodyAddNoti.content
    })
    return res.data
})

const notificationSlice = createSlice({
    name: 'warning',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getAllNotiAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(getAllNotiAsyncThunk.fulfilled, (state, action) => {
            state.listNoti = action.payload
            state.status = "SUCCESS"
        })

        builder.addCase(addNotiCommentAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(addNotiCommentAsyncThunk.fulfilled, (state, action: PayloadAction<INotification>) => {
            state.status = "SUCCESS"
            state.listNoti = [...state.listNoti, action.payload]
        })
    }
})

export default notificationSlice.reducer