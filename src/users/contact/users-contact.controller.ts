import {Body, Controller, Delete, Get, Post} from "@nestjs/common"
import { UsersContactService } from "./users-contact.service"

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

    @Delete('/delete-from-list')
    async removeUserFromContact(@Body() params: { currentUserLogin: string, deleteUserLogin: string }): Promise<{ error?: string, response?: string}> {
        return await this.usersContactService.removeUserFromContact(params.currentUserLogin, params.deleteUserLogin)
    }

    @Get('/my-contacts')
    async getMyContactList(@Body() params: { loginCurrentUser: string }): Promise<Array<string>> {
        return await this.usersContactService.getMyContactList(params.loginCurrentUser)
    }

    @Get('/all-users-list')
    async getAllUsersList(): Promise<{ usersList: Array<string>, usersCount: string }> {
        return await this.usersContactService.getAllUsersList()
    }
}