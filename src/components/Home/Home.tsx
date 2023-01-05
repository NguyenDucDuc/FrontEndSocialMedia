import { Col, Row } from "antd"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { socket } from "../../App"
import { getListHeartAsyncThunk } from "../../Store/Slices/HeartSlice"
import { addPost, getAllPostAsyncThunk } from "../../Store/Slices/PostSlice"
import { RootState, useAppDispatch } from "../../Store/Store"
import { PopopComment } from "../PopopComment/PopopComment"
import { PostCard } from "../PostCard/PostCard"
import "./Home.scss"


export const Home = () => {
    const dispatch = useAppDispatch()
    const listPost = useSelector((state: RootState) => state.listPost.listPost)
    const listHeart = useSelector((state: RootState) => state.heart.listHeart)
    useEffect( () => {
        // DEFINE
        const getListPost = () => {
            dispatch(getAllPostAsyncThunk())
        }
        const getListHeart = () => {
            dispatch(getListHeartAsyncThunk())
        }

        // CALL
        getListHeart()
        getListPost()
        socket.off('serverSendHeart').on('serverSendHeart', (data) => {
            console.log(data)
            dispatch(getAllPostAsyncThunk())
        })

        socket.off('serverSendPost').on('serverSendPost', (data) => {
            dispatch(addPost(data))
        })
    }, [socket])
    return (
        <div className="home">
            <Row>
                {(listPost.length) > 0 ? 
                    listPost.map((post,idx) => {
                        return <Col key={idx} span={6}>
                            {listHeart.findIndex( (heart) => heart.post === post._id ) === -1 ? 
                                <PostCard username={post.user.username} content={post.content} _id={post._id} heart={false} userId={post.user._id} countHeart={post.hearts.length} countComment={post.comments.length} image={post.image} />
                                :
                                <PostCard username={post.user.username} content={post.content} _id={post._id} heart={true} userId={post.user._id} countHeart={post.hearts.length} countComment={post.comments.length} image={post.image} />
                            }
                            
                        </Col>
                    }) 
                    :
                    null
                }
            </Row>
        </div>
    )
}