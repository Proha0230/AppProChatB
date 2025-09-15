import {Injectable} from '@nestjs/common';
import {createUsers, deleteUsers, getOneUsersLogin, getOneUsersId} from "../database/users-repository";

@Injectable()
export class UsersService {
    // по практике - функции в декораторах и в обращении к сервису - должны иметь одно и тоже название
    async getUserId(id: string): Promise<{ login?: string, password?: string, id?: string, error?: string }> {
        return await getOneUsersId(id)
            .then((user) => {
            return user
            })
            .catch(() => {
                return { error: 'Пользователь не найден' }
            })
    }

    async getLogin(params: { login: string, password: string }): Promise<{ error?: string, baererToken?: string }> {
        if (params?.login && params?.password) {
            const userObj = await getOneUsersLogin(params.login)

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

    async deleteUser(id: string): Promise<{ response?: string }> {
        await deleteUsers(id)
        return { response: "Пользователь удален"}
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

    updateUser(id: string, params: { name: string, lastName: string }) {
        return `Редактирование юзера с ID ${id} на новое Имя ${params.name} и фамилию ${params.lastName}`
    }

    searchUser(year: string) {
        return `Пользователи ${year} года рождения - не найдены`
    }
}
