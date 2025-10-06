import {Body, Controller, Get, Headers, Post} from "@nestjs/common"
import { UsersContactService } from "./users-contact.service"
import type { UserAll } from "../../database/db/users/types"

@Controller('users-contact')
export class UsersContactController {
    constructor(private readonly usersContactService: UsersContactService) {}

    @Post('/send-invite')
    async sendInviteUser(@Body() params: { userSendInviteLogin: string, userGetInviteLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.sendInviteUser(params.userSendInviteLogin, params.userGetInviteLogin)
    }

    @Post('/accept-invite')
    async acceptUserInvitation(@Body() params: { userSendInviteLogin: string, userGetInviteLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.acceptUserInvitation(params.userSendInviteLogin, params.userGetInviteLogin)
    }

    @Post('/decline-invite')
    async declineUserInvitation(@Body() params: { userSendInviteLogin: string, userGetInviteLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.declineUserInvitation(params.userSendInviteLogin, params.userGetInviteLogin)
    }

    @Post('/delete-contact')
    async removeUserFromContact(@Body() params: { currentUserLogin: string, deleteUserLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.removeUserFromContact(params.currentUserLogin, params.deleteUserLogin)
    }

    @Get('/all-users-list')
    async getAllUsersList(): Promise<UserAll> {
        return await this.usersContactService.getAllUsersList()
    }

    @Get('/all-sends-invite')
    async getAllUsersSendsInvite(@Headers() params: { authorization: string }) {
        return await this.usersContactService.getAllUsersSendsInvite(params.authorization)
    }

    @Get('/all-whom-sent-invite')
    async getAllUsersWhomSentInvite(@Headers() params: { authorization: string }) {
        return await this.usersContactService.getAllUsersWhomSentInvite(params.authorization)
    }

    @Get('/get-all')
    async getAllUsersContact(@Headers() params: { authorization: string }) {
        return await this.usersContactService.getAllUsersContact(params.authorization)
    }
}