import { Type } from "class-transformer"
import { IsOptional, IsString } from "class-validator"

export class UsersProfileChangeStatusDto {
    @IsOptional()
    @Type(() => String)
    @IsString({ message: 'userGetInviteLogin должен быть string' })
    status?: string
}