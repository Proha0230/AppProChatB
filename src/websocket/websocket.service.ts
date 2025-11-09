import { Injectable } from '@nestjs/common'

@Injectable()
export class WebSocketService {
    // Храним комнаты: ключ — roomId, значение — Set с socket.id пользователей
    // Это нужно, чтобы знать кто в какой комнате, и рассылать им сигналы
    // roomId -> socketId[]
    private rooms = new Map<string, Set<string>>();

    addToRoom(roomId: string, socketId: string): string[] {
        // Проверяем, есть ли уже такая комната; если нет — создаём
        const set = this.rooms.get(roomId) ?? new Set<string>()
        // Добавляем клиента по socket.id в комнату
        set.add(socketId)
        this.rooms.set(roomId, set)

        return [...set]
    }

    // Удаляем пользователя из комнаты, а если комната опустела — убираем её из Map
    removeSocket(socketId: string) {
        for (const [roomId, set] of this.rooms) {
            if (set.delete(socketId) && set.size === 0) this.rooms.delete(roomId);
        }
    }

    getPeers(roomId: string, excludeId?: string): string[] {
        const set = this.rooms.get(roomId) ?? new Set<string>();
        return [...set].filter(id => id !== excludeId);
    }
}
