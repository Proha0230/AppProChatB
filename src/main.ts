import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createTables } from "./database/create-tables";

async function bootstrap() {
  // инициализируем таблицы в БД
  await createTables("users_auth", ['id', 'login', 'password']);
  await createTables("users_contact", ['login_user', 'login_users_in_contact_list', 'login_users_in_invite_list'])

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000); // прослушка порта 3000 или в .env
}

bootstrap()
.then(() => {
    console.log('Database Connected, Server Listening')
})
.catch(error => {
    console.log(error)
})
