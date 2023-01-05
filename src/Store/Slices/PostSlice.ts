import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI, endPoints } from "../../API/Api";


export interface IReqBody {
    content: string;
    image: string;
}

export const getAllPostAsyncThunk = createAsyncThunk('post/getAll', async () => {
    const res = await authAPI().get(endPoints.getAllPost)
    console.log(res.data)
    return res.data
})

export const addPostAsyncThunk = createAsyncThunk('post/add', async (reqBody: IReqBody) => {
    const res = await authAPI().post(endPoints.addPost, {
        content: reqBody.content,
        image: reqBody.image
    })
    console.log(res.data)
    return res.data
})



export interface IPost {
    _id: string;
    content: string;
    image: string;
    user: {
        username: string;
        _id: string;
    };
    hearts: [];
    comments: [];
}

export interface IListPost {
    listPost: IPost[],
    status: string
}

const initialState: IListPost = {
    listPost: [],
    status: ''
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.listPost = [...state.listPost, action.payload]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllPostAsyncThunk.pending, (state) => {
           
           state.status = 'loading'
        })
        builder.addCase(getAllPostAsyncThunk.fulfilled, (state, action) => {
            state.status = 'success'
            state.listPost = action.payload
        })


        builder.addCase(addPostAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(addPostAsyncThunk.fulfilled, (state, action: PayloadAction<IPost>) => {
            state.listPost = [...state.listPost, action.payload]
            state.status = "SUCCESS"
        })
    }
})

export default postSlice.reducer
export const {addPost} = postSlice.actions