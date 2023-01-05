import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";
import { authAPI, endPoints } from "../../API/Api";


export interface IComment {
    _id: string;
    content: string;
    image?: string;
    user: {
        username: string;
        _id?: string;
    }
}

export interface IInitialState {
    listComment: IComment[],
    status?: string
}

export const getAllCommentAsyncThunk = createAsyncThunk("comment/getAll", async (postId: string) => {
    const res = await authAPI().get(endPoints.getComment(postId || ""))
    console.log(res.data)
    return res.data
})

const initialState:IInitialState = {
    listComment: [],
    status: ''
}

export const deleteCommentAsyncThunk = createAsyncThunk("/comment/delete", async (commentId: string) => {
    const res = await authAPI().delete(endPoints.deleteComment(commentId))
    console.log(res.data)
    return res.data
})

export interface IReqBody {
    content: string;
    postId: string;
}
export const addCommentAsyncThunk = createAsyncThunk("comment/add", async (reqBody: IReqBody) => {
    const res = await authAPI().post(endPoints.addComment, {
        content: reqBody.content,
        postId: reqBody.postId
    })
    return res.data
})


const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        addComment: (state, action: PayloadAction<IComment>) => {
            state.listComment = [...state.listComment, action.payload]
            state.status = 'SUCCESS'
        }
    },
    extraReducers: (builder) =>  {
        builder.addCase(getAllCommentAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(getAllCommentAsyncThunk.fulfilled, (state, action: PayloadAction<IComment[]>) => {
            state.listComment = action.payload
            state.status = "SUCCESS"
        })


        builder.addCase(deleteCommentAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(deleteCommentAsyncThunk.fulfilled, (state, action: PayloadAction<IComment>) => {
            state.status = "SUCCESS"
            state.listComment = state.listComment.filter((comment) => comment._id !== action.payload._id)
        })


        builder.addCase(addCommentAsyncThunk.pending, (state) => {
            state.status = "PENDING"
        })
        builder.addCase(addCommentAsyncThunk.fulfilled, (state, action: PayloadAction<IComment>) => {
            state.status = "SUCCESS"
            state.listComment = [...state.listComment, action.payload]
        })
    }
})

export default commentSlice.reducer
export const {addComment} = commentSlice.actions