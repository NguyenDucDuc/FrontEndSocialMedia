import axios from 'axios'


export const API = () => {
    return axios.create({
        baseURL: 'http://localhost:5000',
    })
}

export const authAPI = () => {
    return axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
}

export const endPoints = {
    login: "/user/login",
    getInfo: "/user/get-info",
    getAllPost: "/post/get-all",
    addHeart: "/heart/add",
    getHeart: "/heart/liked",
    getPostDetail: (postId:string) => `/post/detail/${postId}`,
    getComment: (postId:string) => `/comment/get-by-post/${postId}`,
    addComment: "/comment/add",
    currentUser: "/user/current-user",
    addNotification: "/notification/add",
    getAllNotification: "/notification/get-all",
    deleteComment: (commentId:string) => `/comment/delete/${commentId}`,
    addPost: "/post/add",
    addCommentNoti: "/notification/add-noti-comment"
}