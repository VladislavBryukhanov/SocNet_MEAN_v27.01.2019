import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Chat, LocalMessage, Message } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(environment.hostUrl, { path: '/chat_soc' } );
  public messageList: BehaviorSubject<Message[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  subscribeOnChat(chatId: string) {
    this.socket.emit('joinChat', chatId);
    this.socket.on(
      'messageSent',
      (message: Message) => this.messageList.next([
        ...this.messageList.value,
        message
      ])
    );
  }

  unsubscribeFromChat() {
    this.socket.close();
  }

  getChatList(withPopulation?: boolean) {
    const params = {};
    if (withPopulation) {
      Object.assign(
        params,
        { populate: true }
      );
    }

    return this.http.get<Chat[]>('/chat/getChatList', { params });
  }

  findChatByInterlocutor(intelocutor: string) {
    return this.http.get<Chat[]>(`/chat/findChatByInterlocutor/${intelocutor}`);
  }

  getOpenedChat(id: string) {
    return this.http.get<Chat>(`/chat/getChat/${id}`);
  }

  createChat(interlocutorIds: string[]) {
    return this.http.post('/chat/createChat', { interlocutorIds });
  }

  sendMessage(message: LocalMessage) {
    this.socket.emit('sendMessage', message);
  }
}
