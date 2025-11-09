import { Body, Controller, Post, Get, Headers, BadRequestException } from '@nestjs/common'
import { UsersAuthService } from "./users-auth.service"
import { UsersAuthSignInDto, UsersAuthSignUpDto } from "../DTO/auth/usersAuth.dto"
import { IUsersAuthGetInfo, IUsersAuthSignIn, IUsersAuthSignUp } from "../types"

@Controller('users-auth')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    @Post('/sign-up')
    // декоратор @Body() достает payload ручки для дальнейшего использования
    signUp(
        @Body() data: UsersAuthSignUpDto
    ): Promise<IUsersAuthSignUp> {
        return this.usersAuthService.signUp(data)
    }

    @Post('/sign-in')
    signIn(
        @Body() data: UsersAuthSignInDto
    ): Promise<IUsersAuthSignIn> {
        return this.usersAuthService.signIn(data)
    }

    @Get('/get-info')
    getUserInfo(
        @Headers() params: { authorization: string }
    ): Promise<IUsersAuthGetInfo> {

        if (!params.authorization) {
            throw new BadRequestException('У вас нет прав на выполнение этой операции')
        }

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
