export interface IUser
{
    username: string;
    _id: string;
    email: string;
    avatar: {
        contentType: string,
        dataBase64: string
    }
    fullname: string;
    isSuperuser: boolean;
}
