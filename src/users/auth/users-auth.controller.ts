import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersAuthService } from "./users-auth.service";

@Controller('users-auth')
export class UsersAuthController {
    constructor(private readonly usersAuthService: UsersAuthService) {}

    @Post('/create')
    // декоратор @Body() достает payload ручки для дальнейшего использования
    createUser(@Body() params: { login: string, password: string }) {
        return this.usersAuthService.createUser(params)
    }

    @Get('/login')
    getLogin(@Body() params: { login: string, password: string }): Promise<{ error?: string, baererToken?: string }> {
        return this.usersAuthService.getLogin(params)
    }
}
