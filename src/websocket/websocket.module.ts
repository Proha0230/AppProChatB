import { Module } from '@nestjs/common'
import { WebSocketGatewayModule } from './websocket.gateway'
import { WebSocketService } from './websocket.service'

@Module({
    providers: [WebSocketService, WebSocketGatewayModule],
    exports: [WebSocketService, WebSocketGatewayModule],
})
export class WebsocketModule {}