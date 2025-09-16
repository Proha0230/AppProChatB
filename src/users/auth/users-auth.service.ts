import { Injectable } from '@nestjs/common';
import { createUsers, getUsersLogin } from "../../database/db/users_auth/users_auth";

@Injectable()
export class UsersAuthService {
    async getLogin(params: { login: string, password: string }): Promise<{ error?: string, baererToken?: string }> {
        if (params?.login && params?.password) {
            const userObj = await getUsersLogin(params.login)

            if (userObj?.error) {
                return { error: "Пользователь не найден"}
            }

            if (params?.login && params?.password === userObj?.password) {
                return { baererToken: userObj.id }
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
