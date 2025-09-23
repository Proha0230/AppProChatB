import { sqliteGetUsers, sqliteRunUsers } from "../../../db-connection";
import { isUserObject } from "../../../users-repository"

// TODO функция создания нового пользователя
export async function createUsers(user: { id?: string, user_avatar?: null, login?: string, password?: string }): Promise<boolean> {
    // создаем запись в таблице аутентификации
    try {
        await sqliteRunUsers(`
            INSERT INTO users_auth (id, login, password, user_avatar)
            VALUES (?, ?, ?, ?)
        `, [user.id, user.login, user.password, user.user_avatar])

        // создаем запись в таблице контактов
        await sqliteRunUsers(`
            INSERT INTO users_contact (login_user, login_users_in_contact_list, login_users_in_invite_list, user_avatar, user_status)
            VALUES (?, ?, ?, ?, ?)
        `, [user.login, "[]", "[]", user.user_avatar, null])

        return true
    } catch {
        return false
    }
}

// TODO функция авторизации пользователя (сверки Login & Password)
export async function getUsersLogin(login: string): Promise<{ id?: string, login?: string, password?: string, user_avatar?: null, error?: string }> {
    try {
        const data = await sqliteGetUsers(`
            SELECT * FROM users_auth
            WHERE login = ?
        `, [login])

        return isUserObject(data) ? data : { error: "Пользователь не найден" }

    } catch {
        return { error: "Ошибка" }
    }
}

// TODO функция для получения данных по текущему пользователю
export async function getUserById(id: string): Promise<{ login?: string, userAvatar?: null, userStatus?: string, userInviteList?: Array<string>, userContactList?: Array<string>, error?: string }> {
    try {
        const dataAuthUser = await sqliteGetUsers(`
            SELECT * FROM users_auth
            WHERE id = ?
        `, [id])

        const dataContactUser = await sqliteGetUsers(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [dataAuthUser.login])

        const resultDataUser = {
            login: dataContactUser.login_user,
            userAvatar: dataContactUser.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png",
            userStatus: dataContactUser.user_status ?? "Всем привет! Я использую AppProChat!",
            userInviteList: dataContactUser.login_users_in_invite_list,
            userContactList: dataContactUser.login_users_in_contact_list,
        }

        return dataContactUser ? resultDataUser : { error: "Пользователь не найден" }

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