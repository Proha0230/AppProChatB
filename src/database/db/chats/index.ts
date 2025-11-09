import type {UserContactObject, UserInfoObject} from "../users/types"
import {sqliteAllUsers, sqliteGetUsers, sqliteRunChats, sqliteRunUsers} from "../../db-connection"
import {getPlaceholder} from "../users/users_contact/users_contact"
import type {responseError, userChatItem} from "./types"

//TODO функция для извлечения логинов с кем у нас есть чат
function extractNames(chatsList: string[], userWhoRequests: string) {
    return chatsList.map(chats => {
        const [a, b] = chats.split('_and_');
        return a === userWhoRequests ? b : a;
    });
}

// TODO функция по добавлению созданного названия таблицы в БД чатов в список чатов юзеров
export async function addToUsersNewChat(loginUserWhoCreateChat: string, loginUserWithWhomCreateChat: string, nameChatInTable: string) {
    try {
        const objectUserWhoCreateChat: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [loginUserWhoCreateChat])

        const objectUserWithWhomCreateChat: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [loginUserWithWhomCreateChat])

        const userWhoCreateChatChatsList = objectUserWhoCreateChat.user_chats_list
        const userWithWhomCreateChatChatsList = objectUserWithWhomCreateChat.user_chats_list

        let userWhoCreateChatChatsListArr: Array<string> = []

        if (userWhoCreateChatChatsList) {
            try {
                userWhoCreateChatChatsListArr = JSON.parse(userWhoCreateChatChatsList)
            } catch {
                userWhoCreateChatChatsListArr = []
            }
        }

        let userWithWhomCreateChatChatsListArr: Array<string> = []

        if (userWithWhomCreateChatChatsList) {
            try {
                userWithWhomCreateChatChatsListArr = JSON.parse(userWithWhomCreateChatChatsList)
            } catch {
                userWithWhomCreateChatChatsListArr = []
            }
        }

        if (!userWhoCreateChatChatsListArr.includes(nameChatInTable) && !userWithWhomCreateChatChatsListArr.includes(nameChatInTable)) {
            // добавляем в список чатов созданный с пользователем чат (кто создал)
            userWhoCreateChatChatsListArr.push(nameChatInTable)

            // Обновляем запись
            await sqliteRunUsers(`
                UPDATE users_info
                SET user_chats_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(userWhoCreateChatChatsListArr), loginUserWhoCreateChat])


            // добавляем в список чатов созданный с пользователем чат (с кем создали)
            userWithWhomCreateChatChatsListArr.push(nameChatInTable)

            // Обновляем запись
            await sqliteRunUsers(`
                UPDATE users_info
                SET user_chats_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(userWithWhomCreateChatChatsListArr), loginUserWithWhomCreateChat])
        }

        return { response: `Чат с пользователем ${loginUserWithWhomCreateChat} успешно создан`}
    } catch {
        return { response: `Чат с пользователем ${loginUserWithWhomCreateChat} не создан`}
    }
}

//TODO функция по удалению чатов из списка чатов пользователей
export async function deleteChatInUserChatsList(loginUserWhoDeleteChat: string, loginUserWithWhomDeleteChat: string, nameChatInTable: string) {
    try {
        const objectUserWhoDeleteChat: UserInfoObject = await sqliteGetUsers(`
            SELECT *
            FROM users_info
            WHERE login_user = ?
        `, [loginUserWhoDeleteChat])

        const objectUserWithWhomDeleteChat: UserInfoObject = await sqliteGetUsers(`
            SELECT *
            FROM users_info
            WHERE login_user = ?
        `, [loginUserWithWhomDeleteChat])

        const userWhoDeleteChatChatsList = objectUserWhoDeleteChat.user_chats_list
        const userWithWhomDeleteChatChatsList = objectUserWithWhomDeleteChat.user_chats_list

        let userWhoDeleteChatChatsListrr: Array<string> = []

        if (userWhoDeleteChatChatsList) {
            try {
                userWhoDeleteChatChatsListrr = JSON.parse(userWhoDeleteChatChatsList)
            } catch {
                userWhoDeleteChatChatsListrr = []
            }
        }

        let userWithWhomDeleteChatChatsListArr: Array<string> = []

        if (userWithWhomDeleteChatChatsList) {
            try {
                userWithWhomDeleteChatChatsListArr = JSON.parse(userWithWhomDeleteChatChatsList)
            } catch {
                userWithWhomDeleteChatChatsListArr = []
            }
        }

        if (userWhoDeleteChatChatsListrr.includes(nameChatInTable) && userWithWhomDeleteChatChatsListArr.includes(nameChatInTable)) {
            // удаляем из списка чатов чат с пользователем (кто удаляет)
            userWhoDeleteChatChatsListrr = userWhoDeleteChatChatsListrr.filter(chatName => chatName !== nameChatInTable)

            // Обновляем запись
            await sqliteRunUsers(`
                UPDATE users_info
                SET user_chats_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(userWhoDeleteChatChatsListrr), loginUserWhoDeleteChat])


            // удаляем из списка чатов чат с пользователем (с кем удаляем)
            userWithWhomDeleteChatChatsListArr = userWithWhomDeleteChatChatsListArr.filter(chatName => chatName !== nameChatInTable)

            // Обновляем запись
            await sqliteRunUsers(`
                UPDATE users_info
                SET user_chats_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(userWithWhomDeleteChatChatsListArr), loginUserWithWhomDeleteChat])


            // удаляем таблицу из БД с чатом пользователей
            await sqliteRunChats(`
                DROP TABLE IF EXISTS ${nameChatInTable}
`           )
        }

        return { response: `Чат с пользователем ${loginUserWithWhomDeleteChat} успешно удален`}
    } catch {
        return { response: `Чат с пользователем ${loginUserWithWhomDeleteChat} не удален, повторите попытку`}
    }
}

//TODO функция по получению списка всех чатов пользователя
export async function getAllUserChatsList(idUser: string): Promise<Array<userChatItem> | responseError> {
    try {
        const objectUserWhoRequests: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE id = ?
        `, [idUser])

        const userChatsList = objectUserWhoRequests.user_chats_list
        let userChatListArr: Array<any> = []

        if (userChatsList) {
            userChatListArr = JSON.parse(userChatsList) // ["chipa_and_proha", "proha_and_sara"]
        } else {
            userChatListArr = []
        }

        if (userChatListArr.length) {
            let namesUserChatsArr = extractNames(userChatListArr, objectUserWhoRequests.login_user) // ["chipa", "sara"]

            const placeholders = getPlaceholder(namesUserChatsArr)

            // TODO получаем массив объектов всех тех юзеров, с которыми у пользователя есть переписка
            const arrayObjectsUserWithWhomChat: Array<UserContactObject> = await sqliteAllUsers(`
                SELECT *
                FROM users_contact
                WHERE login_user IN (${placeholders})
            `, namesUserChatsArr)


            return arrayObjectsUserWithWhomChat?.map(userObject => {
                return {
                    userLogin: userObject.login_user,
                    userAvatar: userObject.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png"
                }
            })

        } else {
            return []
        }

    } catch {
        return { responseError: "Ошибка получения списка чатов пользователя" }
    }
}

// TODO функция по получению всех сообщений одного чата с пользователем
