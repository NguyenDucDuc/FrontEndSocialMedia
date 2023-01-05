import { Button, Col, Row } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { authAPI, endPoints } from "../../API/Api";
import { socket } from "../../App";
import { addComment, addCommentAsyncThunk, getAllCommentAsyncThunk, IComment, IReqBody } from "../../Store/Slices/CommentSlice";
import { addNotiCommentAsyncThunk, IReqBodyAddNoti } from "../../Store/Slices/NotificationSlice";
import { RootState, useAppDispatch } from "../../Store/Store";
import { CardComment } from "../CardComment/CardComment";
import "./PostDetail.scss"



interface IPost {
    _id?: string;
    content?: string;
    user?: {
        _id: string;
        username: string;
    },
    image?: string;
}



interface ICurrentUser {
    _id: string;
    username: string;
}

export const PostDetail = () => {
    const { postId } = useParams()
    const [post, setPost] = useState<IPost>({ _id: '', content: '', image: 'https://res.cloudinary.com/dlyeizufn/image/upload/v1671331696/cld-sample.jpg' })
    const [comment, setComment] = useState<string>('')
    const [currentUser, setCurrentUser] = useState<ICurrentUser>({_id: '', username: ''})
    const comments = useSelector((state: RootState) => state.comment.listComment)
    const dispatch = useAppDispatch()
    useEffect(() => {
        const getPostDetail = async () => {

            const res = await authAPI().get(endPoints.getPostDetail(postId || ""))
            console.log(res.data)
            setPost(res.data)
        }
        const getAllComment = async () => {
            dispatch(getAllCommentAsyncThunk(postId||'000'))
        }
        getPostDetail()
        getAllComment()
        socket.off('serverSendComment').on('serverSendComment', (data) => {
            
            const newComment: IComment = {
                _id: data.data._id,
                user: data.data.user,
                content: data.data.content
            }
            dispatch(addComment(newComment))
            
        })

    }, [socket, postId])
    useEffect( () => {
        const getCurrentUser = async () => {
            const resCurrentUser = await authAPI().get(endPoints.currentUser)
            setCurrentUser(resCurrentUser.data)
        }
        getCurrentUser()
    }, [])
    const handleAddComment = async () => {
        const reqBody: IReqBody = {
            content: comment,
            postId: postId||''        }
        const res = await dispatch(addCommentAsyncThunk(reqBody))
        console.log(res)
       

        //EMIT TO SERVER
        const resCurrentUser = await authAPI().get(endPoints.currentUser)
        const data = {
            sender: resCurrentUser.data._id,
            receiver: post.user?._id,
            data: res.payload
        }
         socket.emit('clientSendComment', data)

        // ADD NOTIFICATION
        const reqBodyAddNoti: IReqBodyAddNoti = {
            post: postId||'',
            user: post.user?._id||'',
            content: `${resCurrentUser.data.username} đã bình luận về bài viết của bạn`,
            type: 'comment'||''
        }
        await dispatch(addNotiCommentAsyncThunk(reqBodyAddNoti))
        //EMIT NOTIFICATION TO SERVER
        const dataNoti = {
            sender: resCurrentUser.data._id,
            receiver: post.user?._id,
            data: `${resCurrentUser.data.username} đã bình luận về bài viết của bạn`
        }
        socket.emit('clientSendCommentNoti', data)
    }
    return (
        <div className="post-detail">
            <h1>Post Detail</h1>
            {post._id !== "" ?
                <Row>
                    <Col span={14}>
                        <img src={post.image} />
                    </Col>
                    <Col span={10}>
                        <p className="post-detail-content">{post.content}</p>
                    </Col>
                </Row>
                :
                null
            }
            <div className="post-detail-line"></div>
            <div className="comment-controller">
                <TextArea placeholder="enter your comment" rows={4} onChange={e => setComment(e.target.value)} />
                <Button type="primary" onClick={handleAddComment}>Submit</Button>
            </div>
            <div className="comment-item">
            {
                comments.length > 0 ?
                    comments.map((comment, idx) => <CardComment key={idx} currentUserId={currentUser._id} userId={comment.user._id} _id={comment._id} username={comment.user.username} content={comment.content} />)
                    : null
            }
            
            </div>
        </div>
    )
}