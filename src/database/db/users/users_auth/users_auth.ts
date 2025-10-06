import { sqliteGetUsers, sqliteRunUsers } from "../../../db-connection";
import { isUserObject } from "../../../users-repository"
import type { CreateUserObject, UserInfoObject, UserInfoObjectResponse, UserLoginInfo } from "../types";

// TODO функция создания нового пользователя
export async function createUsers(data: CreateUserObject): Promise<boolean> {
    // создаем запись в таблице аутентификации
    try {
        await sqliteRunUsers(`
            INSERT INTO users_auth (id, login, password)
            VALUES (?, ?, ?)
        `, [data.id, data.login, data.password])

        // создаем запись в таблице контактов
        await sqliteRunUsers(`
            INSERT INTO users_contact (login_user, user_avatar, user_status)
            VALUES (?, ?, ?)
        `, [data.login, data.user_avatar, null])

        // создаем запись в таблице контактов
        await sqliteRunUsers(`
            INSERT INTO users_info (id, login_user, user_avatar, user_lang, user_status, user_chats_list, user_black_list, login_users_in_contact_list, login_users_in_invite_list, login_users_whom_i_sent_invite)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [data.id, data.login, data.user_avatar, data.user_lang, null, "[]", "[]", "[]", "[]", "[]"])

        return true
    } catch {
        return false
    }
}

// TODO функция авторизации пользователя (сверки Login & Password)
export async function getUsersLogin(login: string): Promise<UserLoginInfo |{ error?: string }> {
    try {
        const data: UserLoginInfo = await sqliteGetUsers(`
            SELECT * FROM users_auth
            WHERE login = ?
        `, [login])

        return isUserObject(data) ? data : { error: "Пользователь не найден" }

    } catch {
        return { error: "Ошибка" }
    }
}

// TODO функция для получения данных по текущему пользователю
export async function getUserById(id: string): Promise<UserInfoObjectResponse | { error: string }> {
    try {
        const dataUserInfo: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE id = ?
        `, [id])

        return dataUserInfo
            ? {
                login: dataUserInfo.login_user,
                avatar: dataUserInfo.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png",
                lang: dataUserInfo.user_lang,
                status: dataUserInfo.user_status ?? "Всем привет! Я использую AppProChat!",
                chatsList: dataUserInfo.user_chats_list,
                blackList: dataUserInfo.user_black_list,
                usersInInviteList: dataUserInfo.login_users_in_invite_list,
                usersInContactList: dataUserInfo.login_users_in_contact_list,
                usersWhomISentInvite: dataUserInfo.login_users_whom_i_sent_invite
            }
            : { error: "Пользователь не найден" }

    } catch {
        return { error: "Ошибка" }
    }
}

// TODO функция по добавлению ячейки в таблицу БД
// export async function createAddColumn(params: { columnName: string, columnDefaultValue: any }) {
//     try {
//         const defaultValue = typeof params.columnDefaultValue === 'string'
//             ? `'${params.columnDefaultValue.replace(/'/g, "''")}'` // экранируем кавычки
//             : params.columnDefaultValue;
//
//         await sqliteRunUsers(`
//         ALTER TABLE users_contact ADD COLUMN ${params.columnName} TEXT DEFAULT ${defaultValue}
//         `)
//
//         console.log("новая ячейка добавлена в таблицу")
//     } catch {
//         console.log("Ошибка добавления новой ячейки в таблицу")
//     }
// }

// TODO функция (транкейт) по очищению данных таблицы без удаления разметки таблицы
// export async function deleteTableInDb(params: { nameDeleteTable: string }) {
//     try {
//         await sqliteRunUsers(`
//             DELETE FROM ${params.nameDeleteTable}
//         `)
//
//         console.log("Таблица очищена")
//     } catch {
//         console.log("Ошибка при очищении таблицы")
//     }
// }