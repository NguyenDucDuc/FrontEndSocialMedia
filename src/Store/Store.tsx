import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import CommentSlice from "./Slices/CommentSlice";
import HeartSlice from "./Slices/HeartSlice";
import NotificationSlice from "./Slices/NotificationSlice";
import PostSlice from "./Slices/PostSlice";
import UserSlice from "./Slices/UserSlice";



export const store = configureStore({
    reducer: {
        user: UserSlice,
        listPost: PostSlice,
        heart: HeartSlice,
        notification: NotificationSlice,
        comment: CommentSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch 