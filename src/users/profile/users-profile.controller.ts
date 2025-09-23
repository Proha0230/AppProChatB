import { Body, Controller, Post, Get, Headers, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { UsersProfileService } from "./users-profile.service";

@Controller('users-profile')
export class UsersProfileController {
    constructor(private readonly usersAuthService: UsersProfileService) {}

    @Post('/change-avatar')
    // В NestJS интерцепторы — это «прослойки» между входящим запросом и твоим обработчиком. Они могут:
    // •	перехватывать и модифицировать входящие данные,
    // •	добавлять логику до и после выполнения метода,
    // •	изменять ответ.
    // •	Интерцептор вызывает Multer, который вытаскивает файл из тела запроса, кладёт его в req.file и превращает буфер/стрим в удобный объект.
    // 'file' — это имя поля в FormData

    // FileInterceptor + @UploadedFile() — связка:
    // •	Интерцептор → обрабатывает и кладёт файл.
    // •	Декоратор → достаёт файл из req.file.
    @UseInterceptors(FileInterceptor('file'))
    // @UploadedFile() file: Express.Multer.File
    // Декоратор, который достаёт один загруженный файл из запроса и кладёт его в параметр file.
    async changeUserAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Headers() params: { authorization: string }) {
        return await this.usersAuthService.changeUserAvatar(file, params.authorization)
    }

    @Post('/change-status')
    async changeUserStatus(
        @Headers() params: { authorization: string },
        @Body() data: { status: string }) {
        return await this.usersAuthService.changeUserStatus(params.authorization, data.status)
    }
}
