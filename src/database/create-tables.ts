import {sqliteRun} from "./db-connection";

// нам нужно будет запускать БД еще до запуска нашей программы
export async function createTables(nameTable: string, fields: Array<string>): Promise<void> {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRun(`
        CREATE TABLE IF NOT EXISTS ${nameTable} (
            ${fields[0]} TEXT PRIMARY KEY,
            ${fields[1]} TEXT NOT NULL,
            ${fields[2]} TEXT NOT NULL
        )
    `)
}