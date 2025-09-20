import { Injectable } from "@nestjs/common"
import {
    sendUserInviteInContact,
    acceptInvitation,
    declineInvitation,
    removeUserFromContactList,
    getCurrentUserContactList,
    getAllUsersList,
    getUserListSendsInviteContact,
    getUserListContact
} from "../../database/db/users/users_contact/users_contact";

@Injectable()
export class UsersContactService {

    // TODO функция по отправке запроса в добавление в контакты юзера
    async sendInviteUser(userSendInviteLogin: string, userGetInviteLogin: string): Promise<{ error?: string, response?: string}> {
        const status = await sendUserInviteInContact(userSendInviteLogin, userGetInviteLogin)

        if (status) {
            return { response: `Вы отправили заявку на добавление в контакты пользователю ${userGetInviteLogin}`}
        } else {
            return { error: "Ошибка при отправке заявки" }
        }
    }

    // TODO функция принятия запроса в контакты
    async acceptUserInvitation(userSendInviteLogin: string, userGetInviteLogin: string): Promise<{ error?: string, response?: string}> {
        const status = await acceptInvitation(userSendInviteLogin, userGetInviteLogin)

        if (status) {
            return { response: `Вы добавили в контакты пользователя ${userSendInviteLogin}`}
        } else {
            return { error: "Ошибка при добавлении контакта" }
        }
    }

    // TODO функция отклонения запроса в контакты
    async declineUserInvitation(userSendInviteLogin: string, userGetInviteLogin: string): Promise<{ error?: string, response?: string}> {
        const status = await declineInvitation(userSendInviteLogin, userGetInviteLogin)

        if (status) {
            return { response: `Вы отклонили заявку на добавление в контакты от пользователя ${userSendInviteLogin}`}
        } else {
            return { error: "Ошибка при добавлении контакта" }
        }
    }

    // TODO функция удаления пользователя из списка контактов
    async removeUserFromContact(currentUserLogin: string, deleteUserLogin: string): Promise<{ error?: string, response?: string}> {
        const status = await removeUserFromContactList(currentUserLogin, deleteUserLogin)

        if (status) {
            return { response: `Вы удалили пользователя из списка контактов ${deleteUserLogin}`}
        } else {
            return { error: "Ошибка при добавлении контакта" }
        }
    }

    // TODO функция получения списка контактов текущего пользователя
    async getMyContactList(loginCurrentUser: string): Promise<Array<string>> {
        return await getCurrentUserContactList(loginCurrentUser)
    }

    // TODO функция получения всех созданных юзеров
    async getAllUsersList(): Promise<{ usersList: Array<{ userName: string, userContactList: Array<string>, userAvatar: string, userInviteList: Array<string> }>, usersCount: string }> {
        return await getAllUsersList()
    }

    // TODO функция получения всех юзеров отправивших заявки на добавление в контакты пользователя
    async getAllUsersSendsInvite(userId: string): Promise<any> {
        return await getUserListSendsInviteContact(userId)
    }

    // TODO функция получения всех контактов пользователя
    async getAllUsersContact(userId: string): Promise<any> {
        return await getUserListContact(userId)
    }
}