import { Body, Controller, Post, Headers, Get, BadRequestException } from '@nestjs/common'
import { ChatsService } from "./chats.service"
import type { responseError, userChatItem } from "./types";
import { ChatsCreateDto, ChatsDeleteDto, ChatsGoToUserChatDto } from "./DTO/chats/chats.dto"

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}


    @Post("/create")
    async createChat(
        @Headers() params: { authorization: string },
        @Body() data: ChatsCreateDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatsService.createChat(params.authorization, data.loginUserWithWhomCreate)
    }

    @Post("/delete")
    async deleteChat(
        @Headers() params: { authorization: string },
        @Body() data: ChatsDeleteDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatsService.deleteChat(params.authorization, data.loginUserWithWhomDeleteChat)
    }

    @Get("/all-user-chats")
    async getAllUserChats(
        @Headers() params: { authorization: string }
    ): Promise<Array<userChatItem> | responseError> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatsService.getAllUserChats(params.authorization)
    }

    @Post("/go-to-user-chat")
    async getMessagesWithUser(
        @Headers() params: { authorization: string },
        @Body() data: ChatsGoToUserChatDto
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.chatsService.getMessagesWithUser(params.authorization, data.loginWithWhomWeRequestChat)
    }
}