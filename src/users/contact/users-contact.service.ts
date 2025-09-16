import { Injectable } from "@nestjs/common"
import { sendUserInviteInContact } from "../../database/db/users_contact/users_contact";

@Injectable()
export class UsersContactService {

    async sendInviteUser(userSendInviteLogin: string, userGetInviteLogin: string): Promise<{ error?: string, response?: string}> {
        const status = await sendUserInviteInContact(userSendInviteLogin, userGetInviteLogin)

        if (status) {
            return { response: `Вы отправили заявку на добавление в контакты пользователю ${userGetInviteLogin}`}
        } else {
            return { error: "Ошибка при отправке заявки" }
        }
    }
}