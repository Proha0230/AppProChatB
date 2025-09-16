import { sqliteAll, sqliteGet, sqliteRun } from "../../db-connection";

// TODO функция по отправке запроса в добавление в контакты юзера
export async function sendUserInviteInContact(userSendInviteLogin: string, userGetInviteLogin: string): Promise<boolean> {
// выбрать всех из таблицы users_contact
// у кого login_user равен userGetInviteLogin
    try {
        const objDataUserGetInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [userGetInviteLogin])

        // Берём текущее значение всех кто добавил его в контакты
        const currentInviteList = objDataUserGetInviteLogin?.login_users_in_invite_list
        const currentContactList = objDataUserGetInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let invitesList: string[] = []
        let contactList: string[] = []

        if (currentInviteList) {
            try {
                invitesList = JSON.parse(currentInviteList)
            } catch {
                invitesList = []
            }
        }

        if (currentContactList) {
            try {
                contactList = JSON.parse(currentContactList)
            } catch {
                contactList = []
            }
        }

        // Добавляем логин, если его нет в списке инвайтов и нет в списке друзей
        if (!invitesList.includes(userSendInviteLogin) && !contactList.includes(userSendInviteLogin)) {
            invitesList.push(userSendInviteLogin)

            // Обновляем запись
            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_invite_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(invitesList), userGetInviteLogin])
        }

        return true
    } catch {
        return false
    }
}

// TODO функция удаления пользователя из списка контактов
export async function removeUserFromContactList(currentUserLogin: string, deleteUserLogin: string): Promise<boolean> {
    try {
        const objDataCurrentUser = await sqliteGet(`
            SELECT * FROM users_contact
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

        if (currentUserContactList.includes(deleteUserLogin)) {
            contactsCurrentUser = contactsCurrentUser.filter((item: string) => item !== deleteUserLogin)

            // Обновляем запись
            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_contact_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(contactsCurrentUser), currentUserLogin])
        }

        // удалим контакт текущего пользователя из списка контактов пользователя которого удалили
        const objDataDeleteUser = await sqliteGet(`
            SELECT * FROM users_contact
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

        if (deleteUserContactList.includes(currentUserLogin)) {
            contactsDeleteUser = contactsDeleteUser.filter((item: string) => item !== currentUserLogin)

            // Обновляем запись
            await sqliteRun(`
            UPDATE users_contact
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
        const objDataUserGetInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [userGetInviteLogin])

        // Берём текущее значение всех кто добавился в контакты юзеру
        const currentUserInviteList = objDataUserGetInviteLogin?.login_users_in_invite_list
        const currentUserContactList = objDataUserGetInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let invitesCurrentUser: string[] = []
        let contactsCurrentUser: string[] = []

        if (currentUserInviteList) {
            try {
                invitesCurrentUser = JSON.parse(currentUserInviteList)
            } catch {
                invitesCurrentUser = []
            }
        }

        if (currentUserContactList) {
            try {
                contactsCurrentUser = JSON.parse(currentUserContactList)
            } catch {
                contactsCurrentUser = []
            }
        }

        // Удаляем логин юзера кто прислал нам приглашение из списка отправивших заявку в контакт
        if (invitesCurrentUser.includes(userSendInviteLogin)) {
            invitesCurrentUser = invitesCurrentUser.filter((item: string) => item !== userSendInviteLogin)

            await sqliteRun(`
                UPDATE users_contact
                SET login_users_in_invite_list  = ?
                WHERE login_user = ?
            `, [JSON.stringify(invitesCurrentUser), userGetInviteLogin])
        }

        // Добавляем этого юзера в список контактов
        if (!contactsCurrentUser.includes(userSendInviteLogin)) {
            contactsCurrentUser.push(userSendInviteLogin)

            await sqliteRun(`
                UPDATE users_contact
                SET login_users_in_contact_list = ?
                WHERE login_user = ?
            `, [JSON.stringify(contactsCurrentUser), userGetInviteLogin])
        }

        // Обновляем запись
        // await sqliteRun(`
        //     UPDATE users_contact
        //     SET login_users_in_invite_list  = ?,
        //         login_users_in_contact_list = ?
        //     WHERE login_user = ?
        // `, [JSON.stringify(invitesCurrentUser), JSON.stringify(contactsCurrentUser), userGetInviteLogin])

        // обновляем запись для юзера который отправил запрос и его добавили в контакты
        // получаем запись юзера отправившего запрос на добавление текущего юзера в контакты
        const objDataUserSendInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [userSendInviteLogin])

        const sendUserInviteList = objDataUserSendInviteLogin?.login_users_in_invite_list
        const sendUserContactList = objDataUserSendInviteLogin?.login_users_in_contact_list

        // Преобразуем в массив
        let invitesSendUser: string[] = []
        let contactsSendUser: string[] = []

        if (sendUserInviteList) {
            try {
                invitesSendUser = JSON.parse(sendUserInviteList)
            } catch {
                invitesSendUser = []
            }
        }

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

            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_contact_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(contactsSendUser), userSendInviteLogin])
        }

        // Удаляем логин того кто принял в контакты из инвайт листа
        if (invitesSendUser.includes(userGetInviteLogin)) {
            invitesSendUser = invitesSendUser.filter((item: string) => item !== userGetInviteLogin)

            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_invite_list  = ?
            WHERE login_user = ?
        `, [JSON.stringify(invitesSendUser), userSendInviteLogin])
        }

        // Обновляем запись с новым списком контактов
        // await sqliteRun(`
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
        const objDataUserGetInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
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

        // Удаляем логин юзера кто прислал нам приглашение из списка отправивших заявку в контакт
        if (invitesCurrentUser.includes(userSendInviteLogin)) {
            invitesCurrentUser = invitesCurrentUser.filter((item: string) => item !== userSendInviteLogin)

            // Обновляем запись
            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_invite_list  = ?
            WHERE login_user = ?
        `, [JSON.stringify(invitesCurrentUser), userGetInviteLogin])
        }

        // обновляем запись для юзера который отправил запрос и его не добавили в контакты
        // получаем запись юзера отправившего запрос на добавление текущего юзера в контакты
        const objDataUserSendInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [userSendInviteLogin])

        const sendUserInviteList = objDataUserSendInviteLogin?.login_users_in_invite_list

        // Преобразуем в массив
        let invitesSendUser: string[] = []

        if (sendUserInviteList) {
            try {
                invitesSendUser = JSON.parse(sendUserInviteList)
            } catch {
                invitesSendUser = []
            }
        }

        // Удаляем логин того кто принял в контакты из инвайт листа
        if (invitesSendUser.includes(userGetInviteLogin)) {
            invitesSendUser = invitesSendUser.filter((item: string) => item !== userGetInviteLogin)

            // Обновляем запись с новым инвайт списком
            await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_invite_list  = ?
            WHERE login_user = ?
        `, [JSON.stringify(invitesSendUser), userSendInviteLogin])
        }

        return true
    } catch {
        return false
    }
}

// TODO функция получения списка контактов текущего пользователя
export async function getCurrentUserContactList(loginCurrentUser: string): Promise<Array<string>> {
    try {
        // получаем списка контактов текущего пользователя
        const objDataCurrentUser = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [loginCurrentUser])

        return objDataCurrentUser?.login_users_in_contact_list
    } catch {
        return []
    }
}

// TODO функция получения всех созданных юзеров
export async function getAllUserList(): Promise<{ usersList: Array<string>, usersCount: string }> {
    try {
        // получаем список всех созданных юзеров и их кол-во
        const allUserList = await sqliteAll(`
            SELECT * FROM users_contact
        `)

        return { usersList: allUserList, usersCount: allUserList?.length?.toString() || "0"}
    } catch {
        return { usersList: [], usersCount: "0" }
    }
}