import { Injectable } from '@nestjs/common';
import { createUsers, getUsersLogin } from "../../database/db/users/users_auth/users_auth";

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
    async createUser(params: { login?: string, password?: string }) {
        if (params?.login && params?.password) {
            const newUserObj = {
                id: crypto.randomUUID(),
                ...params
            }

            await createUsers(newUserObj)

            return `
                Пользователь создан: 
                Login: ${params.login} 
                Password: ${params.password}
            `
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
    }
}
