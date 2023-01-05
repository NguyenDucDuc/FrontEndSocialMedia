import "./PostCard.scss"
import { CommentOutlined, HeartFilled, HeartOutlined  } from '@ant-design/icons'
import { Button, Col, Row } from "antd"
import { authAPI, endPoints } from "../../API/Api";
import { useState } from "react";
import { useAppDispatch } from "../../Store/Store";
import { getListHeartAsyncThunk } from "../../Store/Slices/HeartSlice";
import { getAllPostAsyncThunk } from "../../Store/Slices/PostSlice";
import { PopopComment } from "../PopopComment/PopopComment";
import { useNavigate } from "react-router-dom";
import { socket } from "../../App";


interface IProps {
    _id?: string;
    username: string;
    passwrd?: string;
    content: string;
    heart?: boolean;
    userId?: string;
    countHeart?: number;
    countComment?: number;
    image?: string;
}

export const PostCard: React.FC<IProps> = ({username, content, _id, heart, userId, countHeart, countComment, image}) => {
    const [listHeart, setListHeart] = useState<[]>([])
    const [popopComment, setPopopComment] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const handleAddHeart = async () => {
        const res = await authAPI().post(endPoints.addHeart, {
            post: _id
        })
        const dispatchHeart = await dispatch(getListHeartAsyncThunk())
        console.log(dispatchHeart)
        dispatch(getAllPostAsyncThunk())

        //EMIT TO SERVER
        const resCurrentUser = await authAPI().get(endPoints.currentUser)
        socket.emit('clientSendHeart', {
            sender: resCurrentUser.data._id,
            receiver: userId,
            heart: !heart
        })
        // Add notification
        if(heart === false){
            const resNotification = await authAPI().post(endPoints.addNotification, {
                content: `${resCurrentUser.data.username} vừa thích bài viết của bạn.`,
                post: _id,
                user: userId,
                type: 'heart'
            })
            console.log(resNotification.data)

            // EMIT TO SERVER
            socket.emit('clientSendNotification', {
                sender: resCurrentUser.data._id,
                receiver: userId,
            })
        }
        
        
        
    }
    const handleComment = () => {
        nav(`/post/${_id}`)
    }
    return (
        <div className="post-card">
            <div className="post-card-action">
                <Row>
                    <Col span={18}>
                        <p>{username}</p>
                    </Col>
                    <Col span={2}>
                        {heart === true ? 
                            <HeartFilled style={{cursor: 'pointer', fontSize: '20px', color: '#ff0066'}} onClick={handleAddHeart} />
                            :
                            <HeartOutlined style={{cursor: 'pointer', fontSize: '20px', color: '#ff0066'}} onClick={handleAddHeart} />
                        }
                        
                        
                    </Col>
                    <Col span={1}><span>{countHeart}</span></Col>
                    <Col span={2}>
                        <CommentOutlined style={{cursor: 'pointer', fontSize: '20px', color: '#ff0066', position:'relative'}} onClick={handleComment} />
                    </Col>
                    <Col span={1}><span>{countComment}</span></Col>
                </Row>
            </div>
            {image !== '' ? 
                <img src={image} />
                :
                <img src="https://res.cloudinary.com/dlyeizufn/image/upload/v1671331697/cld-sample-5.jpg" />
            }
            
            <p>{content}</p>
            
        </div>
    )
}