import { Avatar, Badge, Button, Col, Row } from "antd"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { authAPI, endPoints } from "../../API/Api"
import { RootState, useAppDispatch } from "../../Store/Store"
import "./Header.scss"
import { IUser } from '../../Interface/Interfaces'
import { logout, updateUser } from "../../Store/Slices/UserSlice"
import { socket } from "../../App"
import { getAllNotiAsyncThunk, IReqBodyAddNoti } from "../../Store/Slices/NotificationSlice"



export const Header = () => {
    const username = useSelector((state: RootState) => state.user.user.username)
    const listNoti = useSelector((state: RootState) => state.notification.listNoti)
    const nav = useNavigate()
    const dispatch = useAppDispatch()
    useEffect(() => {
        const getInfo = async () => {
            const res = await authAPI().get(endPoints.getInfo)
            console.log(res.data)
            const newUser: IUser = {
                user: {
                    id: res.data._id,
                    username: res.data.username,
                    password: res.data.password
                },
                accessToken: '',
                status: ''
            }
            dispatch(updateUser(newUser))
        }
        const getAllNoti = () => {
            dispatch(getAllNotiAsyncThunk())
        }
        getInfo()
        if(username !== 'Guest'){
            getAllNoti()
        }
        socket.off('serverSendNotification').on('serverSendNotification', () => {
            dispatch(getAllNotiAsyncThunk())
        })

        socket.off('serverSendCommentNoti').on('serverSendCommentNoti', (data) => {
            dispatch(getAllNotiAsyncThunk())
        })
    }, [socket, username])
    
    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('accessToken')
        //emit to server
        socket.emit('logout')
    }
    const handleNotiDetail = (postId:string) => {
        nav(`/post/${postId}`)
    }
    return (
        <div className="header">
            <Row>
                <Col span={6}>
                    <h1>Social App</h1>
                </Col>
                <Col span={10}>
                    <ul className="header-menu">
                        <li><Link to='/'>Trang chủ</Link></li>
                        <li><Link to='/add-post'>Đăng bài</Link></li>
                        <li><Link to='/'>Thông báo<Badge count={100} overflowCount={listNoti.length}></Badge></Link>
                            <div className="header-noti">
                                {listNoti.length > 0 ? 
                                    listNoti.map( (noti, idx) => <p key={idx} onClick={() => handleNotiDetail(noti.post)}>{noti.content}</p> )
                                    :
                                    null
                                }
                            </div>
                        </li>
                        <li><Link to='/test'>Về chúng tôi</Link></li>
                    </ul>
                </Col>
                <Col span={4}>
                    <Row style={{ lineHeight: '70px' }}>
                        <Col span={10}>
                            {username === 'Guest' ?
                                <Link to='/login'><Button type="primary" style={{}}>Login</Button></Link>
                                :
                                <Link to='/login'><Button type="primary" onClick={handleLogout}>Logout</Button></Link>
                            }
                            
                        </Col>
                        <Col span={10}>
                            <Link to='/register'><Button type="primary" style={{marginLeft: '15px'}}>Register</Button></Link>
                        </Col>
                    </Row>


                </Col>
                <Col span={4}>
                    <p style={{ lineHeight: '70px', textAlign: 'right', fontWeight: 'bold' }}>{username}</p>
                </Col>
            </Row>
           
        </div>
    )
}

