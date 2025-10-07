import { Body, Controller, Post, Headers } from '@nestjs/common'
import { ChatsService } from "./chats.service"

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsCreateService: ChatsService) {}


    @Post("/create")
    async createChat(@Headers() params: { authorization: string }, @Body() data: { loginUserWithWhomCreate: string}) {
        if (params.authorization && data.loginUserWithWhomCreate) {
            return await this.chatsCreateService.createChat(params.authorization, data.loginUserWithWhomCreate)
        }
    }

    @Post("/delete")
    async deleteChat(@Headers() params: { authorization: string }, @Body() data: { loginUserWithWhomCreate: string}) {
        if (params.authorization && data.loginUserWithWhomCreate) {
            return await this.chatsCreateService.deleteChat(params.authorization, data.loginUserWithWhomCreate)
        }
    }
}