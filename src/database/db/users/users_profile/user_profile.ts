import { sqliteRunUsers } from "../../../db-connection";

// TODO функция для изменения аватарки пользователя
export async function editUserAvatar(data: { userLogin: string, urlAvatar: string }) {
    await sqliteRunUsers(`
    UPDATE users_contact SET user_avatar = ?
    WHERE login_user = ?
    `, [data.urlAvatar, data.userLogin])
}

// TODO функция для изменения статуса пользователя
export async function editUserStatus(data: { userLogin: string, status: string }) {
    await sqliteRunUsers(`
    UPDATE users_contact SET user_status = ?
    WHERE login_user = ?
    `, [data.status, data.userLogin])
}