import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { API, endPoints } from "../../API/Api";
import { IReqLogin, IUser } from "../../Interface/Interfaces";
import cookies from 'react-cookies'
import path from "path";






export const loginAsyncThunk = createAsyncThunk('user/login', async (reqBody: IReqLogin) => {
    const res = await API().post(endPoints.login, {
        username: reqBody.username,
        password: reqBody.password
    })
    console.log(res.data)
    if(res.data){
        localStorage.setItem('accessToken', res.data.accessToken)
        return res.data
    }
    
})

const initialState: IUser = {
    user: {
        id: '',
        username: 'Guest',
        password: ''
    },
    accessToken: '',
    status: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<IUser>) => {
            state.user.id = action.payload.user.id
            state.user.username = action.payload.user.username
            state.user.password = action.payload.user.password
            state.accessToken = action.payload.accessToken
            state.status = 'success'
        },
        logout: (state) => {
            state.user.id = ''
            state.user.username = 'Guest'
            state.user.password = ''
            state.accessToken = ''
            state.status = 'success'
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsyncThunk.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(loginAsyncThunk.fulfilled, (state, action: PayloadAction<IUser>) => {
            state.user.id = action.payload.user.id
            state.user.username = action.payload.user.username
            state.user.password = action.payload.user.password
            state.accessToken = action.payload.accessToken
            state.status = 'success'
        })
    }
})

export default userSlice.reducer
export const {updateUser, logout} = userSlice.actions