import { IsString, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class ChatsCreateDto {
    @Type(() => String)
    @IsString({ message: 'loginUserWithWhomCreate должен быть string' })
    @IsNotEmpty({ message: 'loginUserWithWhomCreate не может быть пустым' })
    loginUserWithWhomCreate: string
}

export class ChatsDeleteDto {
    @Type(() => String)
    @IsString({ message: 'loginUserWithWhomDeleteChat должен быть string' })
    @IsNotEmpty({ message: 'loginUserWithWhomDeleteChat не может быть пустым' })
    loginUserWithWhomDeleteChat: string
}

export class ChatsGoToUserChatDto {
    @Type(() => String)
    @IsString({ message: 'loginWithWhomWeRequestChat должен быть string' })
    @IsNotEmpty({ message: 'loginWithWhomWeRequestChat не может быть пустым' })
    loginWithWhomWeRequestChat: string
}