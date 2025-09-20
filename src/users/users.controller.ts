// import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
// import { UsersService } from './users.service';
//
// // когда мы создаем контроллер с префиксом - то NestJS автоматически будет добавлять его к урлу
// // и таким образом наши контроллеры сработают по урлу localhost:3000/my-controller/ или localhost:3000/my-controller/123
// @Controller('users')
// export class UsersController {
//     constructor(private readonly usersService: UsersService) {}
//
//     @Get()
//     getHui(): string {
//         return "ПОШЕЛ НАХУЙ ОТСЮДА"
//     }
//
//     // http://localhost:3000/my-controller/user/search?year=2000
//     // в таком случае мы чтобы достать квери параметры используем декоратор @Query()
//     @Get('/search')
//     searchUser(@Query('year') year: string) {
//         // таким образом мы забираем значение query параметра 'year'
//         return this.usersService.searchUser(year)
//     }
//
//     // таким образом если мы перейдем по localhost:3000/my-controller/123
//     // пишем /: и название переменной которую можно будет использовать
//     @Get('/get/:id')
//     // чтобы нам использовать эту переменную нам надо ее запросить с помощью декоратора @Param()
//     // в который передаем название переменной которую ожидаем и дальше какой переменной назначим это значение
//     // переменная может иметь другое названием вне зависимости от названия параметра в url'e
//     // но лучше чтоб они были одинаковыми
//     getUser(@Param('id') id: string): Promise<{ login?: string, password?: string, id?: string, error?: string }> {
//         return this.usersService.getUserId(id)
//     }
//
//     // либо таким образом достаем несколько параметров из урла
//     // @Get('/user/:id/info/:name')
//     // getHelloUser(
//     //     @Param('id') id: string,
//     //     @Param('name') name: string
//     // ): string {
//     //     return this.appService.getSayHelloId(id, name)
//     // }
//
//
//     // использование декораторов @Param(), @Body() на PATCH декораторе (запросе)
//     @Patch('/update/:id')
//     updateUser(@Param('id') id: string, @Body() params: { name: string, lastName: string }) {
//         return this.usersService.updateUser(id, params)
//     }
//
//     @Delete('/delete')
//         deleteUser(@Body('id') id: string) {
//         return this.usersService.deleteUser(id)
//         }
//
//
//     // @Patch декоратор обновляет обьект
//     // @Put декоратор обновляет целиком ресурс со всеми обьектами
// }
