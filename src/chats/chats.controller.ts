import { Body, Controller, Post, Headers, Get } from '@nestjs/common'
import { ChatsService } from "./chats.service"
import type {responseError, userChatItem} from "../database/db/chats/types";

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}


    @Post("/create")
    async createChat(@Headers() params: { authorization: string }, @Body() data: { loginUserWithWhomCreate: string}) {
        if (params.authorization && data.loginUserWithWhomCreate) {
            return await this.chatsService.createChat(params.authorization, data.loginUserWithWhomCreate)
        }
    }

    @Post("/delete")
    async deleteChat(@Headers() params: { authorization: string }, @Body() data: { loginUserWithWhomDeleteChat: string}) {
        if (params.authorization && data.loginUserWithWhomDeleteChat) {
            return await this.chatsService.deleteChat(params.authorization, data.loginUserWithWhomDeleteChat)
        }
    }

    @Get("/all-user-chats")
    async getAllUserChats(@Headers() params: { authorization: string }): Promise<Array<userChatItem> | responseError> {
        if (params.authorization) {
            return await this.chatsService.getAllUserChats(params.authorization)
        } else {
            return { responseError: "Ошибка запроса. Передайте userId"}
        }
    }
}