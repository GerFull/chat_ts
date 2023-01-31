

export interface Room {
   id: number,
   title: string,
   users: User[],
   chat: ChatMess[]
}

export type User = { user: string, status: boolean }
export type ChatMess = { user: string, message: string, sendOn?: Message }
export type Message= { user: string, message: string }
export type UserLocal = { id: Date, user: string }