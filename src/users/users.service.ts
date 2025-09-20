// import { Injectable } from '@nestjs/common';
// import { deleteUsers, getOneUsersId} from "../database/users-repository";
//
// @Injectable()
// export class UsersService {
//     // по практике - функции в декораторах и в обращении к сервису - должны иметь одно и тоже название
//     async getUserId(id: string): Promise<{ login?: string, password?: string, id?: string, error?: string }> {
//         return await getOneUsersId(id)
//             .then((user) => {
//             return user
//             })
//             .catch(() => {
//                 return { error: 'Пользователь не найден' }
//             })
//     }
//
//     async deleteUser(id: string): Promise<{ response?: string }> {
//         await deleteUsers(id)
//         return { response: "Пользователь удален"}
//     }
//
//     updateUser(id: string, params: { name: string, lastName: string }) {
//         return `Редактирование юзера с ID ${id} на новое Имя ${params.name} и фамилию ${params.lastName}`
//     }
//
//     searchUser(year: string) {
//         return `Пользователи ${year} года рождения - не найдены`
//     }
// }
