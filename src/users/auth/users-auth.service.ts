import { Injectable } from '@nestjs/common';
import { createUsers, getUsersLogin, getUserById } from "../../database/db/users/users_auth/users_auth";

@Injectable()
export class UsersAuthService {

    // TODO функция авторизации пользователя (сверки Login & Password)
    async getLogin(params: { login: string, password: string }): Promise<{ error?: string, bearerToken?: string }> {
        if (params?.login && params?.password) {
            const userObj = await getUsersLogin(params.login)

            if (userObj?.error) {
                return { error: "Пользователь не найден"}
            }

            if (params?.login && params?.password === userObj?.password) {
                return { bearerToken: userObj.id }
            } else {
                return { error: "Пароль неверный"}
            }
        }

        if (params?.login && !params?.password) {
            return { error: "Введите пароль"}
        }

        if (!params?.login && params?.password) {
            return { error: "Введите логин"}
        }

        if (!params?.login && !params?.password) {
            return { error: "Введите логин и пароль"}
        }

        return { error: "Ошибка, попробуйте позже"}
    }

    // TODO функция создания нового пользователя
    async createUser(params: { login?: string, password?: string }) : Promise<{ login?: string, password?:string, error?: string }> {
        if (params?.login && params?.password) {
            const newUserObj = {
                id: crypto.randomUUID(),
                user_avatar: null,
                ...params,
                login: params?.login.toLowerCase(),
            }

            console.log(newUserObj, "newUserObj")
            await createUsers(newUserObj)

            return { login : params.login, password: params.password }
        }

        if (params?.login && !params?.password) {
            return { error: "Введите пароль"}
        }

        if (!params?.login && params?.password) {
            return { error: "Введите логин"}
        }

        if (!params?.login && !params?.password) {
            return { error: "Введите логин и пароль"}
        }

        return { error: "Ошибка регистрации" }
    }

    // TODO функция для получения данных по текущему пользователю
    async getUserInfo(authorization: string): Promise<{ login?: string, userAvatar?: string, error?: string }> {
        if (authorization) {
            return await getUserById(authorization)
        }

        return { error: "Ошибка авторизации. Отказано в доступе"}
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
