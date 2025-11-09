import {Body, Headers, Controller, Post, BadRequestException } from "@nestjs/common"
import { ChatMessageService } from "./chats-message.service"
import { ChatMessageDeleteDto, ChatMessageEditDto, ChatMessageSendDto } from "../DTO/message/chatsMessage.dto"


@Controller('chat-message')
export class ChatMessageController {
    constructor(private readonly chatMessageService: ChatMessageService) {}

    @Post("/send")
    async sendMessage(
        @Headers() params: { authorization: string },
        @Body() data: ChatMessageSendDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatMessageService.sendMessage(params.authorization, data)
    }

    @Post("/delete-message")
    async deleteMessage(
        @Headers() params: { authorization: string },
        @Body() data: ChatMessageDeleteDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatMessageService.deleteMessage(params.authorization, data)
    }

    @Post("/edit-message")
    async editMessage(
        @Headers() params: { authorization: string },
        @Body() data: ChatMessageEditDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatMessageService.editMessage(params.authorization, data)
    }
}