import { Database } from "sqlite3";
import { SQL_PATH } from "../config";

console.log(SQL_PATH, "SQL_PATH")

const db = new Database(SQL_PATH, (error) => {
    if (error) {
        console.error(error);
    }

    console.log('Database Connected');
})

// у db есть 3 метода -
// run - для того чтобы выполнить какую либо команду в БД
// get - для того чтобы достать одну строку из таблицы (одну запись)
// all - для того чтобы достать весь список таблицы

// db.run(` CREATE TABLE users_auth (
//         id INTEGER PRIMARY KEY,
//         login TEXT NOT NULL,
//         password TEXT NOT NULL
//      )`,
//     [], (error: unknown, data: unknown) => {
// // это очень устаревший синтаксис и нужно его переделать на промисы
// })

export function sqliteRun(sql: string, params?: Array<unknown>): Promise<any> {
  return new Promise((resolve, reject) => {
      db.run(sql, params, (error: unknown, data: unknown) => {
          if (error) {
              return reject(error)
          }
          resolve(data)
      })
  })
}

export function sqliteGet(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

export function sqliteAll(sql: string, params?: Array<unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error: unknown, data: unknown) => {
            if (error) {
                return reject(error)
            }
            resolve(data)
        })
    })
}

// мы их сделали ассинхронными и теперь мы можем орудовать async/await c этими промисами