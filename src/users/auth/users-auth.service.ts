import { Injectable } from '@nestjs/common'
import { createUsers, getUsersLogin, getUserById } from "../../database/db/users/users_auth/users_auth"
import {
    CreateUserObject, IUsersAuthSignIn,
    UserInfoObjectResponse,
    UserLoginInfo
} from "../types"

@Injectable()
export class UsersAuthService {

    // TODO функция авторизации пользователя (сверки Login & Password)
    async signIn(params: UserLoginInfo): Promise<IUsersAuthSignIn> {
        try {
            const userObj = await getUsersLogin(params.login)

            if ("error" in userObj) {
                return { error: "Пользователь не найден" }
            }

            if (params?.login && "password" in userObj && params?.password === userObj.password) {
                return { bearerToken: userObj.id }
            } else {
                return { error: "Пароль неверный" }
            }
        } catch {
            return { error: "Ошибка входа, повторите еще раз" }
        }
    }

    // TODO функция создания нового пользователя
    async signUp(data: CreateUserObject) : Promise<UserLoginInfo | { error?: string }> {
        try {
            const newUserObj = {
                id: crypto.randomUUID(),
                user_avatar: null,
                user_lang: "RU",
                password: data?.password,
                login: data?.login.toLowerCase(),
            }

            await createUsers(newUserObj)

            return { login: data.login, password: data.password}
        } catch {
            return { error: "Ошибка регистрации, повторите еще раз" }
        }
    }

    // TODO функция для получения данных по текущему пользователю
    async getUserInfo(authorization: string): Promise<UserInfoObjectResponse | { error: string }> {
        try {
            return await getUserById(authorization)
        } catch {
            return { error: "Ошибка получения данных пользователя"}
        }
    }

    // TODO функция по добавлению ячейки в таблицу БД
    // async addColumn(params: { columnName: string, columnDefaultValue: any }) {
    //         await createAddColumn(params)
    // }

    // TODO функция (транкейт) по очищению данных таблицы без удаления разметки таблицы
    // async deleteTable(params: { nameDeleteTable: string }) {
    //     await deleteTableInDb(params)
    // }
}
