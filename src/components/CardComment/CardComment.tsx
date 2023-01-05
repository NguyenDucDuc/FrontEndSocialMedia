import { DeleteFilled } from "@ant-design/icons";
import { Avatar, Col, Row } from "antd"
import { deleteCommentAsyncThunk } from "../../Store/Slices/CommentSlice";
import { useAppDispatch } from "../../Store/Store";
import "./CardComment.scss"


interface IProps {
    _id?: string;
    content?: string;
    username?: string;
    userId?: string;
    currentUserId?: string;
}

export const CardComment:React.FC<IProps> = ({_id, content, username, userId, currentUserId}) => {
    const dispatch = useAppDispatch()
    const handleDeleteComment = () => {
        dispatch(deleteCommentAsyncThunk(_id||''))
    }
    return (
        <div className="card-comment">
            <Row>
                <Col span={1}>
                    <Avatar src="https://res.cloudinary.com/dlyeizufn/image/upload/v1671331696/cld-sample.jpg" size={64} />
                </Col>
                <Col span={3}>
                <h4>{username}</h4>
                <p>{content}</p>
                </Col>
                <Col span={2}>
                    {currentUserId === userId ? 
                        <DeleteFilled style={{cursor:'pointer'}} onClick={handleDeleteComment} />
                        :
                        null
                    }
                    
                </Col>
                <Col span={18}></Col>
            </Row>
            
        </div>
    )
}