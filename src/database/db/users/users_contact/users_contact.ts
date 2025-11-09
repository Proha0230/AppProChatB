import { sqliteAllUsers, sqliteGetUsers, sqliteRunUsers } from "../../../db-connection";
import {UserAll, UserContactObject, UserContactObjectResponse, UserInfoObject} from "../../../../users/types";

//TODO функция получения плейсхолдеров для получения данных из sql
export function getPlaceholder(array: Array<any>): string {
    return array.map(() => '?').join(', ')
}



// TODO функция по отправке запроса на добавление в контакты юзера
export async function sendUserInviteInContact(userSendInviteLogin: string, userGetInviteLogin: string): Promise<boolean> {
// выбрать всех из таблицы users_contact
// у кого login_user равен userGetInviteLogin
    try {
        const objDataUserGetInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userGetInviteLogin])

        // обьект текущего пользователя кто инвайтнул пользователя
        const objDataUserSendInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userSendInviteLogin])

        // список тех кого текущий пользователь уже заинвайтил в контакты
        const currentUserWhomSentInviteList = objDataUserSendInviteLogin.login_users_whom_i_sent_invite
        let currentUserWhomSentInviteListArr: Array<string> = []

        if (currentUserWhomSentInviteList) {
            try {
                currentUserWhomSentInviteListArr = JSON.parse(currentUserWhomSentInviteList)
            } catch {
                currentUserWhomSentInviteListArr = []
            }
        }

        // Берём текущее значение всех кто уже добавил заинвайченного юзера в контакты
        const userGetInviteList = objDataUserGetInviteLogin?.login_users_in_invite_list
        const userGetContactList = objDataUserGetInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let userGetInviteListArr: Array<string> = []
        let userGetContactListArr: Array<string> = []

        if (userGetInviteList) {
            try {
                userGetInviteListArr = JSON.parse(userGetInviteList)
            } catch {
                userGetInviteListArr = []
            }
        }

        if (userGetContactList) {
            try {
                userGetContactListArr = JSON.parse(userGetContactList)
            } catch {
                userGetContactListArr = []
            }
        }

        // Добавляем логин, если его нет в списке инвайтов и нет в списке друзей
        if (!userGetInviteListArr.includes(userSendInviteLogin) && !userGetContactListArr.includes(userSendInviteLogin) && !currentUserWhomSentInviteListArr.includes(userGetInviteLogin)) {
            userGetInviteListArr.push(userSendInviteLogin)

            // Обновляем запись
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_in_invite_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(userGetInviteListArr), userGetInviteLogin])


            // добавляем в список отправленных инвайтов текущего пользователя
            currentUserWhomSentInviteListArr.push(userGetInviteLogin)

            // Обновляем запись
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_whom_i_sent_invite = ?
            WHERE login_user = ?
        `, [JSON.stringify(currentUserWhomSentInviteListArr), userSendInviteLogin])
        }

        return true
    } catch {
        return false
    }
}

// TODO функция удаления пользователя из списка контактов
export async function removeUserFromContactList(currentUserLogin: string, deleteUserLogin: string): Promise<boolean> {
    try {
        // удаляем пользователя из списка контактов
        const objDataCurrentUser: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [currentUserLogin])

        const currentUserContactList = objDataCurrentUser?.login_users_in_contact_list
        let contactsCurrentUser: string[] = []

        if (currentUserContactList) {
            try {
                contactsCurrentUser = JSON.parse(currentUserContactList)
            } catch {
                contactsCurrentUser = []
            }
        }

        if (contactsCurrentUser.includes(deleteUserLogin)) {
            contactsCurrentUser = contactsCurrentUser.filter((item: string) => item !== deleteUserLogin)

            // Обновляем запись в таблице
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_in_contact_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(contactsCurrentUser), currentUserLogin])
        }


        // удалим контакт текущего пользователя из списка контактов пользователя которого удалили
        const objDataDeleteUser: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [deleteUserLogin])

        const deleteUserContactList = objDataDeleteUser?.login_users_in_contact_list

        let contactsDeleteUser: string[] = []

        if (deleteUserContactList) {
            try {
                contactsDeleteUser = JSON.parse(deleteUserContactList)
            } catch {
                contactsDeleteUser = []
            }
        }

        if (contactsDeleteUser.includes(currentUserLogin)) {
            contactsDeleteUser = contactsDeleteUser.filter((item: string) => item !== currentUserLogin)

            // Обновляем запись в таблице
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_in_contact_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(contactsDeleteUser), deleteUserLogin])
        }

        return true
    } catch {
        return false
    }
}

// TODO функция принятия запроса в контакты
export async function acceptInvitation(userSendInviteLogin: string, userGetInviteLogin: string): Promise<boolean> {
    try {
        const objDataUserGetInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userGetInviteLogin])

        // Берём текущее значение всех кто добавился в контакты юзеру
        const currentUserContactList = objDataUserGetInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let contactsCurrentUser: string[] = []

        if (currentUserContactList) {
            try {
                contactsCurrentUser = JSON.parse(currentUserContactList)
            } catch {
                contactsCurrentUser = []
            }
        }

        // Добавляем юзера отправившего инвайт в список контактов
        if (!contactsCurrentUser.includes(userSendInviteLogin)) {
            contactsCurrentUser.push(userSendInviteLogin)

            // обновляем запись в таблице
            await sqliteRunUsers(`
                UPDATE users_info
                SET login_users_in_contact_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(contactsCurrentUser), userGetInviteLogin])
        }

        // обновляем запись для юзера который отправил запрос и его добавили в контакты
        // получаем запись юзера отправившего запрос на добавление текущего юзера в контакты
        const objDataUserSendInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userSendInviteLogin])

        const sendUserContactList = objDataUserSendInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let contactsSendUser: string[] = []

        if (sendUserContactList) {
            try {
                contactsSendUser = JSON.parse(sendUserContactList)
            } catch {
                contactsSendUser = []
            }
        }

        // Добавляем логин текущего юзера в список контактов отправившего заявку, если его нет в списке
        if (!contactsSendUser.includes(userGetInviteLogin)) {
            contactsSendUser.push(userGetInviteLogin)

            // обновляем запись в таблице
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_in_contact_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(contactsSendUser), userSendInviteLogin])
        }

        // Удаляем логин юзера который заинвайтил нас в контакты из списка заинвайченных
        // так же удаляем нас из его списка заинвайченных юзеров
        await declineInvitation(userSendInviteLogin, userGetInviteLogin)

        // Обновляем запись с новым списком контактов
        // await sqliteRunUsers(`
        //     UPDATE users_contact
        //     SET
        //         login_users_in_invite_list  = ?,
        //         login_users_in_contact_list = ?
        //     WHERE login_user = ?
        // `, [JSON.stringify(invitesSendUser), JSON.stringify(contactsSendUser), userSendInviteLogin])

        return true
    } catch {
        return false
    }
}

// TODO функция отклонения запроса в контакты
export async function declineInvitation(userSendInviteLogin: string, userGetInviteLogin: string): Promise<boolean> {
    try {
        // получаем запись юзера который получил заявку на приглашение в контакты
        const objDataUserGetInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userGetInviteLogin])

        const currentUserInviteList = objDataUserGetInviteLogin?.login_users_in_invite_list

        let invitesCurrentUser: string[] = []

        if (currentUserInviteList) {
            try {
                invitesCurrentUser = JSON.parse(currentUserInviteList)
            } catch {
                invitesCurrentUser = []
            }
        }

        // Удаляем логин юзера приславшего инвайт из списка отправивших нам инвайты
        if (invitesCurrentUser.includes(userSendInviteLogin)) {
            invitesCurrentUser = invitesCurrentUser.filter((item: string) => item !== userSendInviteLogin)

            // Обновляем запись в таблице
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_in_invite_list  = ?
            WHERE login_user = ?
        `, [JSON.stringify(invitesCurrentUser), userGetInviteLogin])
        }


        // обновляем запись для юзера который отправил запрос и его не добавили в контакты
        const objDataUserSendInviteLogin: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE login_user = ?
        `, [userSendInviteLogin])

        const sendUserWhomSentInviteList = objDataUserSendInviteLogin?.login_users_whom_i_sent_invite

        // Преобразуем в массив
        let sendUserWhomSentInviteListArr: string[] = []

        if (sendUserWhomSentInviteList) {
            try {
                sendUserWhomSentInviteListArr = JSON.parse(sendUserWhomSentInviteList)
            } catch {
                sendUserWhomSentInviteListArr = []
            }
        }

        // Удаляем наш логин из списка тех кого заинвайтил юзер
        if (sendUserWhomSentInviteListArr.includes(userGetInviteLogin)) {
            sendUserWhomSentInviteListArr = sendUserWhomSentInviteListArr.filter((item: string) => item !== userGetInviteLogin)

            // Обновляем запись в таблице
            await sqliteRunUsers(`
            UPDATE users_info
            SET login_users_whom_i_sent_invite  = ?
            WHERE login_user = ?
        `, [JSON.stringify(sendUserWhomSentInviteListArr), userSendInviteLogin])
        }

        return true
    } catch {
        return false
    }
}

// TODO функция получения массива обьектов всех созданных юзеров
export async function getAllUsersList(): Promise<UserAll> {
    try {
        // получаем список всех созданных юзеров и их кол-во
        const allUserList: Array<UserContactObject> = await sqliteAllUsers(`
            SELECT * FROM users_contact
        `)

        const resultUserList = allUserList.map((user: UserContactObject) => {
            return {
                userName: user.login_user,
                userStatus: user.user_status ?? "Всем привет! Я использую AppProChat!",
                userAvatar: user.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png"
            }
        })

        return { usersList: resultUserList, usersCount: allUserList?.length?.toString() || "0"}
    } catch {
        return { usersList: [], usersCount: "0" }
    }
}

// TODO функция получения массива обьектов всех юзеров отправивших заявки на добавление в контакты пользователя
export async function getUserListSendsInviteContact(userId: string): Promise<Array<UserContactObjectResponse>> {
    try {
        const objAuthDataUser: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE id = ?
        `, [userId])

        const userInviteList = objAuthDataUser?.login_users_in_invite_list

        let invitesList: string[] = []

        if (userInviteList) {
            try {
                invitesList = JSON.parse(userInviteList)
            } catch {
                invitesList = []
            }
        }

        // делаем плейсхолдеры для IN
        const placeholders = getPlaceholder(invitesList)


        if (placeholders) {
            const data: Array<UserContactObject> = await sqliteAllUsers(`
                SELECT * FROM users_contact
                WHERE login_user IN (${placeholders})
            `, invitesList)

            return data.length ? data.map((user: UserContactObject) => {
                return {
                    userName: user.login_user,
                    userAvatar: user.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png",
                    userStatus: user.user_status ?? "Всем привет! Я использую AppProChat!"
                }
            }) : []
        } else {
            return []
        }

    } catch {
        return []
    }
}

// TODO функция получения массива обьектов всех контактов пользователя
export async function getUserListContact(userId: string): Promise<Array<UserContactObjectResponse>>  {
    try {
        const objAuthDataUser = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE id = ?
        `, [userId])

        const userContactList = objAuthDataUser?.login_users_in_contact_list

        let contactList: string[] = []

        if (userContactList) {
            try {
                contactList = JSON.parse(userContactList)
            } catch {
                contactList = []
            }
        }

        // делаем плейсхолдеры для IN
        const placeholders = getPlaceholder(contactList)


        if (placeholders) {
            const data: Array<UserContactObject> = await sqliteAllUsers(`
                SELECT * FROM users_contact
                WHERE login_user IN (${placeholders})
            `, contactList)

            return data.length ? data.map((user: UserContactObject) => {
                return {
                    userName: user.login_user,
                    userAvatar: user.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png",
                    userStatus: user.user_status ?? "Всем привет! Я использую AppProChat!"
                }
            }) : []
        } else {
            return []
        }

    } catch {
        return []
    }
}

// TODO функция по получению массива обьектов юзеров кому мы отправили инвайты
export async function getAllUsersWhomSentInvite(userId: string): Promise<Array<UserContactObjectResponse>> {
    try {
        const objAuthDataUser: UserInfoObject = await sqliteGetUsers(`
            SELECT * FROM users_info
            WHERE id = ?
        `, [userId])

        const userInviteList = objAuthDataUser?.login_users_whom_i_sent_invite

        let invitesList: string[] = []

        if (userInviteList) {
            try {
                invitesList = JSON.parse(userInviteList)
            } catch {
                invitesList = []
            }
        }

        // делаем плейсхолдеры для IN
        const placeholders = getPlaceholder(invitesList)


        if (placeholders) {
            const data: Array<UserContactObject> = await sqliteAllUsers(`
                SELECT * FROM users_contact
                WHERE login_user IN (${placeholders})
            `, invitesList)

            return data.length ? data.map((user: UserContactObject) => {
                return {
                    userName: user.login_user,
                    userAvatar: user.user_avatar ?? "https://blokator-virusov.ru/img/design/noava.png",
                    userStatus: user.user_status ?? "Всем привет! Я использую AppProChat!"
                }
            }) : []
        } else {
            return []
        }

    } catch {
        return []
    }
}