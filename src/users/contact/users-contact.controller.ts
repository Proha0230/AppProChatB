import { Body, Controller, Post } from "@nestjs/common"
import { UsersContactService } from "./users-contact.service"

@Controller('users-contact')
export class UsersContactController {
    constructor(private readonly usersContactService: UsersContactService) {}

    @Post('/send-invite')
    async sendInvite(@Body() params: { userSendInviteLogin: string, userGetInviteLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.sendInviteUser(params.userSendInviteLogin, params.userGetInviteLogin)
    }
}