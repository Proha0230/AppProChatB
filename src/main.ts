import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createTablesUsers, createTablesChats } from "./database/create-tables";

async function bootstrap() {
  // инициализируем таблицы в БД
  await createTablesUsers("users_auth", ['id', 'login', 'password', 'user_avatar']);
  await createTablesUsers("users_contact", ['login_user', 'login_users_in_contact_list', 'login_users_in_invite_list', 'user_avatar']);

  // для теста
  await createTablesChats("sara_and_proha", ['login_user_one', 'login_user_two', 'login_user_write', 'message_text', 'message_id']);

  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:3000'], // или твой фронтовый домен
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
    // credentials: true, // если используешь куки / auth headers
  })

  await app.listen(process.env.PORT ?? 3023) // прослушка порта 3000 или в .env
}

bootstrap()
.then(() => {
    console.log('Database Connected, Server Listening')
})
.catch(error => {
    console.log(error)
})
