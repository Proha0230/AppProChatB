import { Body, Controller, Post, Get, Headers } from '@nestjs/common';
import { UsersAuthService } from "./users-auth.service";

@Controller('users-auth')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    @Post('/sign-up')
    // декоратор @Body() достает payload ручки для дальнейшего использования
    createUser(@Body() params: { login: string, password: string }): Promise<{ login?: string, password?:string, error?: string }> {
        return this.usersAuthService.createUser(params)
    }

    @Post('/sign-in')
    getLogin(@Body() params: { login: string, password: string }): Promise<{ error?: string, baererToken?: string }> {
        return this.usersAuthService.getLogin(params)
    }

    @Get('/get-info')
    getUserInfo(@Headers () params: { authorization: string }): Promise<{ login?: string, userAvatar?: null, userStatus?: string, userInviteList?: Array<string>, userContactList?: Array<string>, error?: string }> {
        return this.usersAuthService.getUserInfo(params.authorization)
    }

    // @Patch('/add-column')
    // addColumn(@Body() params: { columnName: string, columnDefaultValue: any }) {
    //     return this.usersAuthService.addColumn(params)
    // }

    // @Post('/delete-table')
    // deleteTable(@Body() params: { nameDeleteTable: string }) {
    //     return this.usersAuthService.deleteTable(params)
    // }
}
