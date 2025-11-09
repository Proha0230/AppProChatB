import { IsString, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class UsersContactSendOrAcceptOrDeclineInviteDto {
    @Type(() => String)
    @IsString({ message: 'userSendInviteLogin должен быть string' })
    @IsNotEmpty({ message: 'userSendInviteLogin не может быть пустым' })
    userSendInviteLogin: string

    @Type(() => String)
    @IsString({ message: 'userGetInviteLogin должен быть string' })
    @IsNotEmpty({ message: 'userGetInviteLogin не может быть пустым' })
    userGetInviteLogin: string
}

export class UsersContactDeleteContactDto {
    @Type(() => String)
    @IsString({ message: 'currentUserLogin должен быть string' })
    @IsNotEmpty({ message: 'currentUserLogin не может быть пустым' })
    currentUserLogin: string

    @Type(() => String)
    @IsString({ message: 'deleteUserLogin должен быть string' })
    @IsNotEmpty({ message: 'deleteUserLogin не может быть пустым' })
    deleteUserLogin: string
}