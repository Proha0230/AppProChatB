export interface UserInfoObject {
    id: string,
    login_user: string,
    user_avatar: null | string,
    user_lang:string,
    user_status: null | string,
    user_chats_list: string,
    user_black_list: string,
    login_users_in_contact_list: string,
    login_users_in_invite_list: string,
    login_users_whom_i_sent_invite: string
}

export interface UserInfoObjectResponse {
    login: string,
    avatar: null | string,
    lang: string,
    status: null | string,
    chatsList: string, // Array<string>,
    blackList: string, // Array<string>,
    usersInContactList: string, // Array<string>,
    usersInInviteList: string, // Array<string>,
    usersWhomISentInvite: string, // Array<string>
}

export interface UserContactObject {
    login_user: string,
    user_status: string,
    user_avatar: string
}

export interface UserContactObjectResponse {
    userName: string,
    userAvatar: string,
    userStatus: string
}

export interface UserAll {
    usersList: Array<{userName: string, userStatus: string, userAvatar: string}>,
    usersCount: string
}

export interface UserLoginInfo {
    id?: string,
    login: string,
    password: string
}

export interface CreateUserObject {
    login: string
    password: string
    id?: string
    user_avatar?: null | string
    user_lang?: string
}

export interface IUsersAuthSignUp {
    login?: string
    password?:string
    error?: string
}

export interface IUsersAuthSignIn {
    error?: string
    bearerToken?: string
}

export interface IUsersAuthGetInfo {
    login?: string
    userAvatar?: string
    userStatus?: string
    userInviteList?: Array<string>
    userContactList?: Array<string>
    error?: string
}

export interface IUsersContactSendOrAcceptOrDeclineInvite {
    error?: string
    response?: string
}

export interface IUsersContactDeleteContact {
    error?: string
    response?: string
}