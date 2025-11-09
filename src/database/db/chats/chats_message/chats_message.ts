import { resultMessageInChatList } from "../../../../chats/types"
import type { UserInfoObject } from "../../../../users/types"
import { sqliteGetUsers, sqliteRunChats } from "../../../db-connection"

// TODO функция по получению названия таблицы чата в БД
export async function getTableNameInChatsDb(userIdWhoMakingRequest: string, userNameWhoBeingAsked: string) {
    try {
        const objectUserWhoSentMessage: UserInfoObject = await sqliteGetUsers(`
            SELECT *
            FROM users_info
            WHERE id = ?
        `, [userIdWhoMakingRequest])

        const userChatsList = objectUserWhoSentMessage.user_chats_list
        let userChatListArr: Array<string> = []

        if (userChatsList) {
            userChatListArr = JSON.parse(userChatsList)
        } else {
            userChatListArr = []
        }

        return userChatListArr.filter(chatName => chatName.includes(userNameWhoBeingAsked))?.[0]
    } catch {
        return undefined
    }
}

// TODO функция по созданию даты вида "09 ноября 2025, 20:19"
export function createDate() {
    const date = new Date()
    return date
        .toLocaleString('ru-RU', { // форматирует дату по русской локали
            day: '2-digit',     // День всегда из двух цифр (например, 09)
            month: 'long',      // Месяц выводится полностью: "ноября", "января"
            year: 'numeric',    // Год в полном виде: "2025"
            hour: '2-digit',    // Часы из двух цифр: "08", "20"
            minute: '2-digit'   // Минуты из двух цифр: "03", "19"
        })
        .replace(' г.', '')
}

// TODO функция по отправке сообщения в чат
export async function sendMessageInTable(userIdWhoSent: string, data: resultMessageInChatList) {
    try {
        const tableNameWithWhomTheUserRequesting = await getTableNameInChatsDb(userIdWhoSent, data.userWhoReceived)

        if (tableNameWithWhomTheUserRequesting) {
            const currentDate = createDate()

            await sqliteRunChats(`
                INSERT INTO ${tableNameWithWhomTheUserRequesting} (user_who_wrote, user_who_received, message_dispatch_time, 
                                                                   message_text, message_is_text, message_is_image, message_is_voice, 
                                                                   message_is_editable, message_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [data.userWhoWrote, data.userWhoReceived, currentDate, data.messageText, data.messageIsText, data.messageIsImage, data.messageIsVoice, data.messageIsEditable, data.messageId])

            return { response: "Сообщение успешно отправлено" }
        } else {
            return { responseError: "Ошибка отправки сообщения"}
        }

    } catch {
        return { responseError: "Ошибка отправки сообщения"}
    }
}

// TODO функция по удалению сообщений из чата
export async function deleteMessageFromTable(userIdWhoDeletes: string, userWhoReceived: string, idMessage: string) {
    try {
        const tableNameWithWhomTheUserRequesting = await getTableNameInChatsDb(userIdWhoDeletes, userWhoReceived)

        if (tableNameWithWhomTheUserRequesting) {
            await sqliteRunChats(`
            DELETE FROM ${tableNameWithWhomTheUserRequesting}
            WHERE message_id = ?
            `, [idMessage])

            return { response: "Сообщение успешно удалено" }
        } else {
            return { responseError: "Сообщение не было удалено, повторите попытку"}
        }

    } catch {
        return { responseError: "Сообщение не было удалено, повторите попытку"}
    }
}

// TODO функция по редактированию сообщения в чате
export async function editMessageFromTable(userIdWhoEdit: string, userWhoReceived: string, messageText: string, idMessage: string) {
    try {
        const tableNameWithWhomTheUserRequesting = await getTableNameInChatsDb(userIdWhoEdit, userWhoReceived)

        if (tableNameWithWhomTheUserRequesting) {
            const currentDate = `Изменено в ${createDate()}`

            await sqliteRunChats(`
            UPDATE ${tableNameWithWhomTheUserRequesting} 
            SET message_text = ?, message_is_editable = ?, message_dispatch_time = ?
            WHERE message_id = ?
            `, [messageText, true, currentDate, idMessage])

            return { response: "Сообщение успешно изменено" }
        } else {
            return { responseError: "Сообщение не было изменено, повторите попытку"}
        }

    } catch {
        return { responseError: "Сообщение не было изменено, повторите попытку"}
    }
}