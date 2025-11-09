import { BadRequestException, Body, Controller, Get, Headers, Post } from "@nestjs/common"
import { UsersContactService } from "./users-contact.service"
import { IUsersContactDeleteContact, IUsersContactSendOrAcceptOrDeclineInvite, UserAll } from "../types"
import { UsersContactDeleteContactDto, UsersContactSendOrAcceptOrDeclineInviteDto } from "../DTO/contact/usersContact.dto"

@Controller('users-contact')
export class UsersContactController {
    constructor(private readonly usersContactService: UsersContactService) {}

    @Post('/send-invite')
    async sendInviteUser(
        @Headers() params: { authorization: string },
        @Body() data: UsersContactSendOrAcceptOrDeclineInviteDto
    ): Promise<IUsersContactSendOrAcceptOrDeclineInvite> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.sendInviteUser(data.userSendInviteLogin, data.userGetInviteLogin)
    }

    @Post('/accept-invite')
    async acceptUserInvitation(
        @Headers() params: { authorization: string },
        @Body() data: UsersContactSendOrAcceptOrDeclineInviteDto
    ): Promise<IUsersContactSendOrAcceptOrDeclineInvite> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.acceptUserInvitation(data.userSendInviteLogin, data.userGetInviteLogin)
    }

    @Post('/decline-invite')
    async declineUserInvitation(
        @Headers() params: { authorization: string },
        @Body() data: UsersContactSendOrAcceptOrDeclineInviteDto
    ): Promise<IUsersContactSendOrAcceptOrDeclineInvite> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.declineUserInvitation(data.userSendInviteLogin, data.userGetInviteLogin)
    }

    @Post('/delete-contact')
    async removeUserFromContact(
        @Headers() params: { authorization: string },
        @Body() data: UsersContactDeleteContactDto
    ): Promise<IUsersContactDeleteContact> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.removeUserFromContact(data.currentUserLogin, data.deleteUserLogin)
    }

    @Get('/all-users-list')
    async getAllUsersList(
        @Headers() params: { authorization: string }
    ): Promise<UserAll> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.getAllUsersList()
    }

    @Get('/all-sends-invite')
    async getAllUsersSendsInvite(
        @Headers() params: { authorization: string }
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.getAllUsersSendsInvite(params.authorization)
    }

    @Get('/all-whom-sent-invite')
    async getAllUsersWhomSentInvite(
        @Headers() params: { authorization: string }
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.getAllUsersWhomSentInvite(params.authorization)
    }

    @Get('/get-all')
    async getAllUsersContact(
        @Headers() params: { authorization: string }
    ) {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

        return await this.usersContactService.getAllUsersContact(params.authorization)
    }
}