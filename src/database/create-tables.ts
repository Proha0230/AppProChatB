import {sqliteRun} from "./db-connection";

// нам нужно будет запускать БД еще до запуска нашей программы
export async function createTables() {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRun(`
        CREATE TABLE IF NOT EXISTS users_auth (
            id TEXT PRIMARY KEY,
            login TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `)
}