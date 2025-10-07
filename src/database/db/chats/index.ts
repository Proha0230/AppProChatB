import {UserInfoObject} from "../users/types";
import {sqliteGetUsers, sqliteRunChats, sqliteRunUsers} from "../../db-connection";

// TODO функция по добавлению созданного названия таблицы в БД чатов в список чатов юзеров
export async function addToUsersNewChat(loginUserWhoCreateChat: string, loginUserWithWhomCreateChat: string, nameChatInTable: string) {
    try {
        const objectUserWhoCreateChat: UserInfoObject = await sqliteGetUsers(`
            SELECT *
            FROM users_info
            WHERE login_user = ?
        `, [loginUserWhoCreateChat])

        const objectUserWithWhomCreateChat: UserInfoObject = await sqliteGetUsers(`
            SELECT *
            FROM users_info
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