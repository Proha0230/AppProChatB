import { sqliteRunUsers, sqliteRunChats } from "./db-connection";

//TODO Создание таблицы авторизации
export async function createTablesUsersAuth(nameTable: string, fields: Array<string>): Promise<void> {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRunUsers(`
        CREATE TABLE IF NOT EXISTS ${nameTable} (
            ${fields[0]} TEXT PRIMARY KEY,
            ${fields[1]} TEXT NOT NULL,
            ${fields[2]} TEXT NOT NULL
        )
    `)
}

//TODO Создание таблицы контактов
export async function createTablesUsersContact(nameTable: string, fields: Array<string>): Promise<void> {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRunUsers(`
        CREATE TABLE IF NOT EXISTS ${nameTable} (
            ${fields[0]} TEXT PRIMARY KEY,
            ${fields[1]} TEXT,
            ${fields[2]} TEXT
        )
    `)
}

//TODO Создание таблицы инфо о юзерах
export async function createTablesUsersInfo(nameTable: string, fields: Array<string>): Promise<void> {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRunUsers(`
        CREATE TABLE IF NOT EXISTS ${nameTable} (
            ${fields[0]} TEXT PRIMARY KEY,
            ${fields[1]} TEXT,
            ${fields[2]} TEXT,
            ${fields[3]} TEXT,
            ${fields[4]} TEXT,
            ${fields[5]} TEXT,
            ${fields[6]} TEXT,
            ${fields[7]} TEXT,
            ${fields[8]} TEXT,
            ${fields[9]} TEXT
        )
    `)
}

export async function createTablesChats(nameTable: string, fields: Array<string>): Promise<void> {
    // CREATE TABLE IF NOT EXISTS - создать таблицу если не существует, если уже существует
    // то команда будет проигнорирована

    // CREATE TABLE - просто создать таблицу
    await sqliteRunChats(`
        CREATE TABLE IF NOT EXISTS ${nameTable} (
            ${fields[0]} TEXT NOT NULL,
            ${fields[1]} TEXT NOT NULL,
            ${fields[2]} TEXT NOT NULL,
            ${fields[3]} TEXT NOT NULL,
            ${fields[4]} TEXT PRIMARY KEY
        )
    `)
}