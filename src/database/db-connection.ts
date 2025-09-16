import { Database } from "sqlite3";
import { SQL_PATH_USERS, SQL_PATH_CHATS } from "../config";

const dbUsers = new Database(SQL_PATH_USERS, (error) => {
    if (error) {
        console.error(error);
    }

    console.log('Database USERS Connected');
})

const dbChats = new Database(SQL_PATH_CHATS, (error) => {
    if (error) {
        console.error(error);
    }

    console.log('Database CHATS Connected');
})
// у db есть 3 метода -
// run - для того чтобы выполнить какую либо команду в БД
// get - для того чтобы достать одну строку из таблицы (одну запись)
// all - для того чтобы достать весь список таблицы

// dbUsers.run(` CREATE TABLE users_auth (
//         id INTEGER PRIMARY KEY,
//         login TEXT NOT NULL,
//         password TEXT NOT NULL
//      )`,
//     [], (error: unknown, data: unknown) => {
// // это очень устаревший синтаксис и нужно его переделать на промисы
// })

// TODO для БД USERS
export function sqliteRunUsers(sql: string, params?: Array<unknown>): Promise<any> {
  return new Promise((resolve, reject) => {
      dbUsers.run(sql, params, (error: unknown, data: unknown) => {
          if (error) {
              return reject(error)
          }
          resolve(data)
      })
  })
}

export function sqliteGetUsers(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        dbUsers.get(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

export function sqliteAllUsers(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        dbUsers.all(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

// TODO для БД CHATS
export function sqliteRunChats(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        dbChats.run(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

export function sqliteGetChats(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        dbChats.get(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

export function sqliteAllChats(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        dbChats.all(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}
// мы их сделали ассинхронными и теперь мы можем орудовать async/await c этими промисами