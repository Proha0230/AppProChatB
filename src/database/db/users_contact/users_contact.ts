import { sqliteGet, sqliteRun } from "../../db-connection";

// получение записи юзера которого хотим добавить
// добавляем у этого юзера в поле id_users_invite_list объект JSON с логином юзера который его добавил
export async function sendUserInviteInContact(userSendInviteLogin: string, userGetInviteLogin: string): Promise<boolean> {
// выбрать всех из таблицы users_contact
// у кого login_user равен userGetInviteLogin
    try {
        const objDataUserGetInviteLogin = await sqliteGet(`
            SELECT * FROM users_contact
            WHERE login_user = ?
        `, [userGetInviteLogin])

        // Берём текущее значение всех кто добавил его в контакты
        const currentList = objDataUserGetInviteLogin?.login_users_in_invite_list

        // Преобразуем в массив
        let invites: string[] = []

        if (currentList) {
            try {
                invites = JSON.parse(currentList)
            } catch {
                invites = []
            }
        }

        // Добавляем логин, если его нет в списке
        if (!invites.includes(userSendInviteLogin)) {
            invites.push(userSendInviteLogin)
        }

        // Обновляем запись
        await sqliteRun(`
            UPDATE users_contact
            SET login_users_in_invite_list = ?
            WHERE login_user = ?
        `, [JSON.stringify(invites), userGetInviteLogin])

        return true
    } catch {
        return false
    }
}