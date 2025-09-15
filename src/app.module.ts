import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

// Модуль определенный блок кода который выполняет одну задачу
// контроллер - то что берет урл и слушает его - выполняя определенный функционал
// сервис - то где располагается логика - которую мы вызовем в декораторе контроллера

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
// это основной модуль и если у нас их будет много, то все остальные модули мы импортируем сюда
// через декоратор @Module
