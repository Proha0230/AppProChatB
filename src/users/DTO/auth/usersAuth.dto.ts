import { IsString, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class UsersAuthSignInDto {
    @Type(() => String)
    @IsString({ message: 'login должен быть string' })
    @IsNotEmpty({ message: 'login не может быть пустым' })
    login: string

    @Type(() => String)
    @IsString({ message: 'password должен быть string' })
    @IsNotEmpty({ message: 'password не может быть пустым' })
    password: string
}

export class UsersAuthSignUpDto {
    @Type(() => String)
    @IsString({ message: 'login должен быть string' })
    @IsNotEmpty({ message: 'login не может быть пустым' })
    login: string

    @Type(() => String)
    @IsString({ message: 'password должен быть string' })
    @IsNotEmpty({ message: 'password не может быть пустым' })
    password: string
}