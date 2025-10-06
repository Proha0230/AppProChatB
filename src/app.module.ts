import { Module } from '@nestjs/common';
import { UsersContactController } from "./users/contact/users-contact.controller"
import { UsersContactService } from "./users/contact/users-contact.service";
import { UsersProfileService } from "./users/profile/users-profile.service";
import { UsersProfileController } from "./users/profile/users-profile.controller";
import { UsersAuthController } from './users/auth/users-auth.controller';
import { UsersAuthService } from './users/auth/users-auth.service';
import { ChatsController } from './chats/chats.controller';
import { ChatsService } from './chats/chats.service';
import { HttpModule } from "@nestjs/axios";
import { ChatsCreateController } from "./chats/create/chats-create.controller";
import { ChatsCreateService } from "./chats/create/chats-create.service";

// Модуль определенный блок кода который выполняет одну задачу
// контроллер - то что берет урл и слушает его - выполняя определенный функционал
// сервис - то где располагается логика - которую мы вызовем в декораторе контроллера

@Module({
  imports: [HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
  }),],
  controllers: [UsersContactController, UsersAuthController, ChatsController, UsersProfileController, ChatsCreateController],
  providers: [UsersContactService, UsersAuthService, ChatsService, UsersProfileService, ChatsCreateService],
})
export class AppModule {}
// это основной модуль и если у нас их будет много, то все остальные модули мы импортируем сюда
// через декоратор @Module
