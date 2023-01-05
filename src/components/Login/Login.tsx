import { Button, Input } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API, authAPI, endPoints } from '../../API/Api'
import { socket } from '../../App'
import { IReqLogin } from '../../Interface/Interfaces'
import { loginAsyncThunk } from '../../Store/Slices/UserSlice'
import { useAppDispatch } from '../../Store/Store'
import "./Login.scss"

export const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()
    const dispatch = useAppDispatch()
    const handleLogin = async () => {
        const reqLogin: IReqLogin = {
            username: username,
            password: password
        }
        await dispatch(loginAsyncThunk(reqLogin))
        const resCurrentUser = await authAPI().get(endPoints.currentUser)
        console.log(resCurrentUser.data._id)
        socket.emit('login', {userId: resCurrentUser.data._id})
        nav('/')
    }
    return (
        <div className='login'>
            <h1>LOGIN PAGE</h1>
            <div className='login-form'>
                <Input type='text' placeholder='enter username...' onChange={e => setUsername(e.target.value)} />
                <Input type='password' placeholder='enter password...' onChange={e => setPassword(e.target.value)} />
                <Button type='primary' onClick={handleLogin}>Login</Button>
            </div>
        </div>
    )
}