import { Injectable } from '@nestjs/common'
import { getUserById } from "../../database/db/users/users_auth/users_auth"
import { createTablesChats } from "../../database/create-tables"
import type { UserInfoObjectResponse } from "../../database/db/users/types"

@Injectable()
export class ChatsCreateService {

    //TODO функция для создания чата между двумя пользователями
    async createChat(idUserWhoCreateChat: string, loginUserWithWhomCreateChat: string) {
        try {
            const userWhoCreateChatObj: UserInfoObjectResponse | {
                error: string
            } = await getUserById(idUserWhoCreateChat)

            if ("login" in userWhoCreateChatObj) {
                const getTableNameChat = `${userWhoCreateChatObj.login}_and_${loginUserWithWhomCreateChat}`

                // создаем чат если его еще нет между двумя пользователями в БД
                await createTablesChats(`${getTableNameChat}`, ['login_user_one', 'login_user_two', 'login_user_write', 'message_text', 'message_id'])

                return { response: "Чат успешно создан"}
            }
        } catch {
            return { responseError: "Ошибка создания чата"}
        }
    }

}