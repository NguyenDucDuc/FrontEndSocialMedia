import userEvent from "@testing-library/user-event"
import { Button } from "antd"
import Input from "antd/es/input/Input"
import TextArea from "antd/es/input/TextArea"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { socket } from "../../App"
import { addPostAsyncThunk, IReqBody } from "../../Store/Slices/PostSlice"
import { RootState, useAppDispatch } from "../../Store/Store"
import "./AddPost.scss"


interface ICurrentUser {
    _id?: string;
    username?: string;
    
}

export const AddPost = () => {
    const [content, setContent] = useState<string>('')
    const [image, setImage] = useState<File>()
    const currentUser = useSelector((state: RootState) => state.user.user)
    const dispatch = useAppDispatch()

    const handleAddPost = () => {
        if (image !== undefined) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "testuploadimage")
            data.append("cloud_name", "dlyeizufn")
            fetch("  https://api.cloudinary.com/v1_1/dlyeizufn/image/upload", {
                method: "post",
                body: data
            })
                .then(resp => resp.json())
                .then(async data => {
                    console.log(data.url)
                    const reqBody: IReqBody = {
                        content: content,
                        image: data.url
                    }
                    const resAddPost = await dispatch(addPostAsyncThunk(reqBody))
                    // EMIT POST MOI LEN SERVER
                    socket.emit('clientSendPost',  resAddPost.payload)
                })
                .catch(err => console.log(err))
        } else {
            console.log("Loi undefined")
        }

    }
    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files || e.target.files.length === 0) {
            // you can display the error to the user
        } else {
            setImage(e.target.files[0])
        }
    }

    const handleTest = () => {
        console.log(currentUser.id)
    }
    return (
        <div className="add-post">
            <h1>Add Post</h1>
            <Input type="file" placeholder="Choose image" onChange={handleChangeImage} />
            <TextArea placeholder="enter your content" cols={4} onChange={e => setContent(e.target.value)} />
            <Button type="primary" onClick={handleAddPost}>Submit</Button>
            <Button onClick={handleTest}>Test user id</Button>
        </div>
    )
}