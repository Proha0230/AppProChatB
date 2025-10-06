import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    createTablesChats,
    createTablesUsersAuth,
    createTablesUsersInfo,
    createTablesUsersContact
} from "./database/create-tables";

async function bootstrap() {
  // инициализируем таблицы в БД
  await createTablesUsersAuth("users_auth",
      ['id', 'login', 'password'])

  await createTablesUsersContact("users_contact",
      ['login_user', 'user_avatar', 'user_status'])

  await createTablesUsersInfo("users_info",
      ['id', 'login_user', 'user_avatar', 'user_lang', 'user_status', 'user_chats_list',
          'user_black_list', 'login_users_in_contact_list', 'login_users_in_invite_list', 'login_users_whom_i_sent_invite'])

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
