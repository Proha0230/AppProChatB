import { sqliteGet, sqliteRun } from "../../db-connection";
import { isUserObject } from "../../users-repository"

// вставить в нашу таблицу users_auth запись
export async function createUsers(user: { id?: string, login?: string, password?: string }): Promise<boolean> {
    // создаем запись в таблице аутентификации
    try {
        await sqliteRun(`
            INSERT INTO users_auth (id, login, password)
            VALUES (?, ?, ?)
        `, [user.id, user.login, user.password])

        // создаем запись в таблице контактов
        await sqliteRun(`
            INSERT INTO users_contact (login_user, login_users_in_contact_list, login_users_in_invite_list)
            VALUES (?, ?, ?)
        `, [user.login, "[]", "[]"])

        return true
    } catch {
        return false
    }
}

// выбрать всех из таблицы users_auth
// у кого login равен login
export async function getUsersLogin(login: string): Promise<{ id?: string, login?: string, password?: string, error?: string }> {
    try {
        const data = await sqliteGet(`
            SELECT *
            FROM users_auth
            WHERE login = ?
        `, [login])

        return isUserObject(data) ? data : { error: "Пользователь не найден" }

    } catch {
        return { error: "Ошибка" }
    }
}