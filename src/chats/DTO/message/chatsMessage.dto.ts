import {IsString, IsNotEmpty, IsBoolean} from 'class-validator'
import { Type } from 'class-transformer'

export class ChatMessageSendDto {
    @Type(() => String)
    @IsString({ message: 'userWhoWrote должен быть string' })
    @IsNotEmpty({ message: 'userWhoWrote не может быть пустым' })
    userWhoWrote: string

    @Type(() => String)
    @IsString({ message: 'userWhoReceived должен быть string' })
    @IsNotEmpty({ message: 'userWhoReceived не может быть пустым' })
    userWhoReceived: string

    @Type(() => String)
    @IsString({ message: 'messageText должен быть string' })
    @IsNotEmpty({ message: 'messageText не может быть пустым' })
    messageText: string

    @Type(() => Boolean)
    @IsBoolean({ message: 'messageIsText должен быть boolean' })
    @IsNotEmpty({ message: 'messageText не может быть пустым' })
    messageIsText: boolean

    @Type(() => Boolean)
    @IsBoolean({ message: 'messageIsImage должен быть boolean' })
    @IsNotEmpty({ message: 'messageIsImage не может быть пустым' })
    messageIsImage: boolean

    @Type(() => Boolean)
    @IsBoolean({ message: 'messageIsVoice должен быть boolean' })
    @IsNotEmpty({ message: 'messageIsVoice не может быть пустым' })
    messageIsVoice: boolean

    @Type(() => Boolean)
    @IsBoolean({ message: 'messageIsEditable должен быть boolean' })
    @IsNotEmpty({ message: 'messageIsEditable не может быть пустым' })
    messageIsEditable: boolean
}

export class ChatMessageDeleteDto {
    @Type(() => String)
    @IsString({message: 'idMessage должен быть string'})
    @IsNotEmpty({message: 'idMessage не может быть пустым'})
    idMessage: string

    @Type(() => String)
    @IsString({message: 'userWhoReceived должен быть string'})
    @IsNotEmpty({message: 'userWhoReceived не может быть пустым'})
    userWhoReceived: string
}

export class ChatMessageEditDto {
    @Type(() => String)
    @IsString({message: 'idMessage должен быть string'})
    @IsNotEmpty({message: 'idMessage не может быть пустым'})
    idMessage: string

    @Type(() => String)
    @IsString({message: 'userWhoReceived должен быть string'})
    @IsNotEmpty({message: 'userWhoReceived не может быть пустым'})
    userWhoReceived: string

    @Type(() => String)
    @IsString({message: 'messageText должен быть string'})
    @IsNotEmpty({message: 'messageText не может быть пустым'})
    messageText: string
}