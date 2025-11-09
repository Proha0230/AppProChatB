import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { WebSocketService } from './websocket.service'

// Типы сообщений, которые будут приходить от клиентов через WebSocket
// join — пользователь заходит в комнату
// offer / answer — стандартные сигналы WebRTC
// ice — передаёт ICE-кандидата для соединения
type Payload =
    { type: 'join', roomId: string } |
    { type: 'offer', roomId: string, sdp: any } |
    { type: 'answer', roomId: string, sdp: any } |
    { type: 'ice', roomId: string, candidate: any }

// Декоратор создаёт WebSocket сервер (socket.io под капотом)
// cors: {origin: '*'} — разрешаем подключения с любого источника (удобно при разработке)
@WebSocketGateway({
    cors: { origin: '*', credentials: false },
    transports: ['websocket'],
})
export class WebSocketGatewayModule {
    @WebSocketServer() io: Server
    constructor(private readonly webSocketService: WebSocketService) {}

    // Метод вызывается при каждом входящем сообщении "signal" от клиента
    // msg — данные сигнала, socket — соединение отправителя
    @SubscribeMessage('signal')
    async handleSignal(@MessageBody() msg: Payload, @ConnectedSocket() socket: Socket) {
        console.log(msg, "msg")
        console.log(socket.id, "socket.id")

        if (msg.type === 'join') {
            const peers = this.webSocketService.addToRoom(msg.roomId, socket.id)

            // socket.join позволяет использовать socket.io комнаты (для рассылки по roomId)
            socket.join(msg.roomId)

            // Отправляем обратно клиенту подтверждение, что он вошёл
            // peers — список id других участников комнаты (чтобы знать с кем соединяться)
            socket.emit('signal', { type: 'joined', peers: peers.filter(id => id !== socket.id) })
            return
        }

        if ('roomId' in msg) {
            // socket.to(roomId) — всем в комнате, кроме отправителя
            socket.to(msg.roomId).emit('signal', { from: socket.id, ...msg })
        }
    }

    // handleDisconnect вызывается автоматически при разрыве соединения клиента
    handleDisconnect(socket: Socket) {
        this.webSocketService.removeSocket(socket.id)
    }
}