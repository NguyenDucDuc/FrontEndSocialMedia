


export interface IUser {
    user: {
        id: string;
        username: string;
        password: string;
    }
    accessToken: string;
    status: string;
}

export interface IReqLogin {
    username: string;
    password: string;
}

export interface IHeart {
    _id: string;
    user: string;
    post: string
}