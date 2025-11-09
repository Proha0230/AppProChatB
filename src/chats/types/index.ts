export interface userChatItem {
    userAvatar: string,
    userLogin: string
}

export interface responseError {
    responseError: string
}

export interface messageInChatList {
    user_who_wrote: string,
    user_who_received: string,
    message_dispatch_time: string,
    message_text: string,
    message_is_text: boolean,
    message_is_image: boolean,
    message_is_voice: boolean,
    message_is_editable: boolean,
    message_id: string
}

export interface resultMessageInChatList {
    userWhoWrote: string,
    userWhoReceived: string,
    messageDispatchTime?: string,
    messageText: string,
    messageIsText: boolean,
    messageIsImage: boolean,
    messageIsVoice: boolean,
    messageIsEditable: boolean,
    messageId?: string
}