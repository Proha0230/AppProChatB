import { Injectable } from '@nestjs/common'
import { getUserById } from "../database/db/users/users_auth/users_auth"
import { createTablesChats } from "../database/create-tables"
import {addToUsersNewChat, deleteChatInUserChatsList} from "../database/db/chats"
import type { UserInfoObjectResponse } from "../database/db/users/types"

@Injectable()
export class ChatsService {

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

                const { response } = await addToUsersNewChat(userWhoCreateChatObj.login, loginUserWithWhomCreateChat, getTableNameChat)

                return { response: response}
            }
        } catch {
            return { responseError: "Ошибка создания чата"}
        }
    }

    //TODO функция по удалению чатов из списка чатов пользователей и удалению таблицы из БД с чатами
    async deleteChat(idUserWhoDeleteChat: string, loginUserWithWhomDeleteChat: string) {
        try {
            const userWhoDeleteChatObj: UserInfoObjectResponse | { error: string } = await getUserById(idUserWhoDeleteChat)

            if ("login" in userWhoDeleteChatObj) {
                const chatsListWhoDelete = userWhoDeleteChatObj.chatsList

                let chatsListWhoDeleteArr: Array<string> = []
                let getTableNameChat: string = ""

                if (chatsListWhoDelete) {
                    chatsListWhoDeleteArr = JSON.parse(chatsListWhoDelete)

                    // ищем в массиве чатов - чат с юзером который мы хотим удалить
                    getTableNameChat = chatsListWhoDeleteArr.filter(chatName => chatName.includes(loginUserWithWhomDeleteChat))?.[0]
                }

                // если найден общий чат то удаляем его из записей пользователей и удаляем таблицу из БД с чатами
                if (getTableNameChat) {
                    const { response } = await deleteChatInUserChatsList(userWhoDeleteChatObj.login, loginUserWithWhomDeleteChat, getTableNameChat)

                    return { response: response }
                }

                return { response: "Чат не найден"}
            }
        } catch {
            return { responseError: "Ошибка удаления чата"}
        }
    }
}