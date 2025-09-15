import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createTables } from "./database/create-tables";

async function bootstrap() {
  // инициализируем БД
  await createTables()

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
