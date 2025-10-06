import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { ChatsCreateService } from "./chats-create.service";

@Controller('chats-create')
export class ChatsCreateController {
    constructor(private readonly chatsCreateService: ChatsCreateService) {}


    @Post()
    async createChat(@Headers() params: { authorization: string }, @Body() data: { loginUserWithWhomCreate: string}) {
        if (params.authorization && data.loginUserWithWhomCreate) {
            await this.chatsCreateService.createChat(params.authorization, data.loginUserWithWhomCreate);
        }
    }
}