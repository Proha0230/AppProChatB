import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    createTablesChats,
    createTablesUsersAuth,
    createTablesUsersInfo,
    createTablesUsersContact
} from "./database/create-tables";
import { BadRequestException, ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  // инициализируем таблицы в БД
  await createTablesUsersAuth("users_auth",
      ['id', 'login', 'password'])

  await createTablesUsersContact("users_contact",
      ['login_user', 'user_avatar', 'user_status'])

  await createTablesUsersInfo("users_info",
      ['id', 'login_user', 'user_avatar', 'user_lang', 'user_status', 'user_chats_list',
          'user_black_list', 'login_users_in_contact_list', 'login_users_in_invite_list', 'login_users_whom_i_sent_invite'])

  // для теста создаем таблицу с чатом в БД
  await createTablesChats("testone_and_testtwo", ['user_who_wrote', 'user_who_received',
      'message_dispatch_time', 'message_text', 'message_is_text', 'message_is_image', 'message_is_voice',
      'message_is_editable', 'message_id'])

  const app = await NestFactory.create(AppModule)


// app.useGlobalPipes() подключает пайпы (pipes) — это middleware NestJS, которые перехватывают данные до вызова контроллера.
// ValidationPipe — один из встроенных пайпов, который:
// проверяет DTO через class-validator, преобразует типы через class-transformer, может фильтровать поля и выбрасывать ошибки.
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // TODO Удаляет все лишние поля, которых нет в DTO
        transform: true, // TODO Включает преобразование типов из plain-object в экземпляры классов DTO.
        transformOptions: { enableImplicitConversion: true }, // TODO Позволяет class-transformer автоматически конвертировать
        // TODO например строку в number - если свойство в DTO имеет тип number и мы не указали @Type(() => Number) вручную (забыли)
        stopAtFirstError: true, // TODO Если true — валидация остановится на первой ошибке. Если false — соберёт все ошибки и вернёт их списком.

        exceptionFactory: (errors) => new BadRequestException({ // TODO Позволяет кастомизировать формат ошибок, возвращаемых при валидации.
            message: 'Validation failed',
            errors: errors.map(e => ({
                field: e.property, // TODO имя поля
                constraints: e.constraints // TODO описание ошибок с ним
            })),
        })

        // TODO вернет ошибку в таком формате
        // {
        //     "message": "Validation failed",
        //     "errors": [
        //     {
        //         "field": "text",
        //         "constraints": { "isNotEmpty": "text не может быть пустым" }
        //     }
        // ]
        // }
    }))

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
