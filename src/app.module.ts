import { Module } from '@nestjs/common'
import { UsersContactController } from "./users/contact/users-contact.controller"
import { UsersContactService } from "./users/contact/users-contact.service"
import { UsersProfileService } from "./users/profile/users-profile.service"
import { UsersProfileController } from "./users/profile/users-profile.controller"
import { UsersAuthController } from './users/auth/users-auth.controller'
import { UsersAuthService } from './users/auth/users-auth.service'
import { ChatsController } from "./chats/chats.controller"
import { ChatsService } from './chats/chats.service'
import { WebsocketModule } from "./websocket/websocket.module"
import { HttpModule } from "@nestjs/axios"
import { ChatMessageController } from "./chats/message/chats-message.controller"
import { ChatMessageService } from "./chats/message/chats-message.service"

// Модуль определенный блок кода который выполняет одну задачу
// контроллер - то что берет урл и слушает его - выполняя определенный функционал
// сервис - то где располагается логика - которую мы вызовем в декораторе контроллера

@Module({
  imports: [
      HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      }),
      WebsocketModule],
  controllers: [UsersContactController, UsersAuthController, ChatsController, UsersProfileController, ChatMessageController],
  providers: [UsersContactService, UsersAuthService, ChatsService, UsersProfileService, ChatMessageService],
})
export class AppModule {}
// это основной модуль и если у нас их будет много, то все остальные модули мы импортируем сюда
// через декоратор @Module
