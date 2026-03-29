export type UserRegister = {
    username: string;
    email: string;
    password: string;
}

export type UserLogin = {
    email: string;
    password: string;
}

export type User = {
    email: string
    username: string
    _id: string
}
