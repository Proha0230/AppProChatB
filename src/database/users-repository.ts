// репозиторий это адаптер для БД
// набор функций которые позволяют общаться с БД
// создадим 5 методов -
// Create
// Update
// Delete
// GetOne
// GetMany

import {sqliteAll, sqliteGet, sqliteRun} from "./db-connection";

// обновить таблицу users_auth поменять поле
// у id такого то
export async function updateUsers(user): Promise<void> {
    await sqliteRun(`
    UPDATE users_auth SET password = ?
    WHERE id = ?
    `, [user.password, user.id])
    // [user.password, user.id] - порядок уже другой т.к. порядок вопросов ( = ? ) у нас другой
    // сначала мы говорим про password (обновить его) и затем про id (у какой записи обновить)
}

// удалить из таблицы users_auth
// WHERE id = ? - что удалить, если не укажем что удалять (запись) - удалится вся таблица
export async function deleteUsers(id: string): Promise<void> {
    await sqliteRun(`
    DELETE FROM users_auth
    WHERE id = ?
    `, [id])
}

// выбрать всех из таблицы users_auth
// у кого айди равен id
export async function getOneUsersId(id: string): Promise<{ id?: string, login?: string, password?: string, error?: string }> {
    const data = await sqliteGet(`
        SELECT * FROM users_auth
        WHERE id = ?
    `, [id])

    if (isUserObject(data)) {
        return data
    } else {
        return { error: "Пользователь не найден"}
    }
}

// выбрать всех из таблицы users_auth
export async function getAllUsers(): Promise<Array<{ id?: string, login?: string, password?: string }> | { error?: string }> {
    const data = await sqliteAll(`
        SELECT * FROM users_auth
    `)

    if (!Array.isArray(data)) {
        return { error: "Ошибка данных."}
    } else {
        return data.map(user => {
            if (isUserObject(user)) {
                return user
            }
        })
    }
}

// typeGuard - проверка на то, что мы вернули запись о юзере
export function isUserObject(user: { id: string, login: string, password: string }): boolean {
    return Boolean(user && typeof user === 'object' && user.id && user.login && user.password)
}