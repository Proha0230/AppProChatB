import { Injectable } from "@nestjs/common"
import type { resultMessageInChatList } from "../types"
import { sendMessageInTable, deleteMessageFromTable, editMessageFromTable } from "../../database/db/chats/chats_message/chats_message"

@Injectable()
export class ChatMessageService {

    // TODO функция по отправке сообщения в чат
    async sendMessage(userIdWhoSent: string, data: resultMessageInChatList) {
        const resultObj = {
            ...data,
            messageId: crypto.randomUUID()
        }

        return await sendMessageInTable(userIdWhoSent, resultObj)
    }

    // TODO функция по удалению сообщений из чата
    async deleteMessage(userIdWhoDeletes: string, data: { idMessage: string, userWhoReceived: string }) {
        return await deleteMessageFromTable(userIdWhoDeletes, data.userWhoReceived, data.idMessage)
    }

    // TODO функция по редактированию сообщения в чате
    async editMessage(userIdWhoEdit: string, data: { idMessage: string, userWhoReceived: string, messageText: string }) {
        return await editMessageFromTable(userIdWhoEdit, data.userWhoReceived, data.messageText, data.idMessage)
    }
}