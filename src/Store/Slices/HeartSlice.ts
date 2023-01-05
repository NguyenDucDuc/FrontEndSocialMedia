import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI, endPoints } from "../../API/Api";
import {IHeart} from '../../Interface/Interfaces'


export const getListHeartAsyncThunk = createAsyncThunk("heart/get", async () => {
    const res = await authAPI().get(endPoints.getHeart)
    return res.data
})

interface IListHeart {
    listHeart: IHeart[]
    status: string
}

const initialState:IListHeart = {
    status: '',
    listHeart: []
}

const heartSlice = createSlice({
    name: 'heart',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getListHeartAsyncThunk.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(getListHeartAsyncThunk.fulfilled, (state, action) => {
            state.status = "success"
            state.listHeart = action.payload
        })
    }
})

export default heartSlice.reducer