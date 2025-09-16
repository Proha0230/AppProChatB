import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersContactController } from "./users/contact/users-contact.controller"
import { UsersContactService } from "./users/contact/users-contact.service";
import { UsersService } from './users/users.service';
import { UsersAuthController } from './users/auth/users-auth.controller';
import { UsersAuthService } from './users/auth/users-auth.service';

// Модуль определенный блок кода который выполняет одну задачу
// контроллер - то что берет урл и слушает его - выполняя определенный функционал
// сервис - то где располагается логика - которую мы вызовем в декораторе контроллера

@Module({
  imports: [],
  controllers: [UsersController, UsersContactController, UsersAuthController],
  providers: [UsersService, UsersContactService, UsersAuthService],
})
export class AppModule {}
// это основной модуль и если у нас их будет много, то все остальные модули мы импортируем сюда
// через декоратор @Module
