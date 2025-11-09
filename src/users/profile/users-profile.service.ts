import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { editUserAvatar, editUserStatus } from "../../database/db/users/users_profile/user_profile"
import FormData from 'form-data'
import sharp from 'sharp'
import { sqliteGetUsers } from "../../database/db-connection"
import { lastValueFrom } from 'rxjs'
import type { UserInfoObject } from "../types";

@Injectable()
export class UsersProfileService {
    constructor(private readonly httpService: HttpService) {}

    // TODO функция для изменения аватарки пользователя
    async changeUserAvatar(userAvatar: Express.Multer.File, userId: string) {
        try {
            // получаем объект юзера из бд
            const objDataUser: UserInfoObject = await sqliteGetUsers(`
                SELECT * FROM users_info
                WHERE id = ?
            `, [userId])

            const form = new FormData()

            // TODO sharp - либа для уменьшения размера и качества больших ихображений
            const optimized = await sharp(userAvatar.buffer)
                // уменьшаем размер до 1024 если он больше изначально, если меньше - пропускаем
                .resize({ width: 1024, withoutEnlargement: true }) // опционально
                // изменяем формат на webp
                .webp({ quality: 80 }) // или .jpeg({ quality: 80 })
                // возвращаем буфер для отправки на хостинг
                .toBuffer()


            // можно и так отправлять
            // form.append('image', userAvatar.buffer.toString('base64')) // ImgBB ждёт base64 или файл

            form.append('image', optimized, {
                filename: userAvatar.originalname.replace(/\.[^.]+$/, '') + '.webp', // если конвертировали
                contentType: 'image/webp',
                knownLength: optimized.length,
            })

            const url = "https://api.imgbb.com/1/upload?expiration=600&key=7993d6af5b6d689e2a5a15c35ab17b46"

            // TODO отправляем на хостинг изображение в буфере
            const responseObservable = this.httpService.post(url, form, {
                headers: form?.getHeaders(),
            })

            // subscribe() сразу возвращает объект Subscription — это не данные, а поток данных где можно обработать колбэки.
            // responseObservable.subscribe({
            //     // next — данные потока (у axios это AxiosResponse). Срабатывает каждый раз, когда Observable отдаёт значение.
            //     // Приходит объект AxiosResponse (у HttpService NestJS), где есть data, status, headers и т.д.
            //     // Особенность: Observable может эмитить много значений (например, поток WebSocket). У HttpService это только одно — ответ HTTP запроса.
            //     next: async ( response) => {
            //         try {
            //             const {data} = response?.data
            //             const url = data?.url
            //
            //             const objData = {
            //                 userLogin: objDataUser.login,
            //                 urlAvatar: url
            //             }
            //
            //             if (objData.urlAvatar && objData.userLogin) {
            //                 // обновляем аватар пользователя
            //                 await editUserAvatar(objData)
            //             }
            //         } catch (error) {
            //             console.log(error, "error")
            //         }
            //     },
            //
            //     // error — срабатывает, если что-то пошло не так, после error поток сразу завершается (дальше next не будет).
            //     error: (err) => {
            //         console.error(err); // ошибка
            //     },
            //
            //     // Когда срабатывает: когда Observable успешно завершился (больше данных не будет).
            //     // Что приходит: ничего (это просто сигнал).
            //     // Особенность: если был error, complete уже не вызовется.
            //     complete: () => {
            //         console.log('Аватар обновлен'); // опциональный колбэк, если поток завершён
            //     },
            // })

            // TODO lastValueFrom утилита из RxJS, которая превращает Observable в Promise, дожидаясь последнего значения потока.
            // HttpService в NestJS возвращает Observable (потому что построен на RxJS) - таким образом
            // превращаем в Promise и можем дожидаться его результата с помощью писать async/await.
            const { data } = await lastValueFrom(responseObservable)

            const objData = {
                userLogin: objDataUser.login_user,
                userId: userId,
                urlAvatar: data?.data?.url
            }

            if (objData.urlAvatar && objData.userLogin) {
                // обновляем аватар пользователя
                await editUserAvatar(objData)
            }

            return { response: objData.urlAvatar }
        } catch {
            return { responseError: "Ошибка обновления аватара"}
        }
    }

    // TODO функция для изменения статуса пользователя
    async changeUserStatus(userId: string, status?: string) {
        if (userId && status) {
            try {
                // получаем объект юзера из бд
                const objDataUser: UserInfoObject = await sqliteGetUsers(`
                    SELECT * FROM users_auth
                    WHERE id = ?
                `, [userId])


                const objData = {
                    userId: userId,
                    userLogin: objDataUser.login_user,
                    status: status ? status : null,
                }

                await editUserStatus(objData)

                return { responseMes: "Ваш статус изменен."}
            } catch {
                return { responseMes: "Ошибка изменения статуса."}
            }
        }
    }
}
