import { Injectable } from '@nestjs/common'
import { getUserById } from "../database/db/users/users_auth/users_auth"
import { createTablesChats } from "../database/create-tables"
import {addToUsersNewChat, deleteChatInUserChatsList, getAllUserChatsList} from "../database/db/chats"
import type { UserInfoObjectResponse } from "../database/db/users/types"
import type { userChatItem, responseError } from "../database/db/chats/types"

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
                await createTablesChats(`${getTableNameChat}`, ['user_who_wrote', 'user_who_received', 'message_dispatch_time',
                    'message_text', 'message_is_text', 'message_is_image', 'message_is_voice', 'message_is_editable', 'message_id'])

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

    //TODO функция по получению списка всех чатов пользователя
    async getAllUserChats(idUser: string): Promise<Array<userChatItem> | responseError> {
            return await getAllUserChatsList(idUser)
    }
}