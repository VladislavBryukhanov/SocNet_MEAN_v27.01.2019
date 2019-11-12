import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Chat, LocalMessage, Message } from '../models/chat';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket;
  public messageList: BehaviorSubject<Message[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  subscribeOnChat(chatId: string): Observable<Message[]> {
    const token = this.authService.authToken;
    this.socket = io(
      environment.hostUrl, {
        path: '/chat_soc',
        query: { token }
      }
    );

    this.socket.emit('joinChat', chatId);

    this.socket.on(
      'fetchMessages',
      (messages: Message[]) => this.messageList.next(messages)
    );

    this.socket.on('messageSent', (message: Message) =>
      this.messageList.next([
        ...this.messageList.value,
        message
      ])
    );

    return this.messageList.asObservable();
  }

  unsubscribeFromChat() {
    if (this.socket) {
      this.socket.close();
    }
  }

  sendMessage(message: LocalMessage) {
    return new Promise((resolve, reject) => 
      this.socket.emit(
        'sendMessage',
        message,
        (data) => data.exists ? resolve() : reject()
      )
    );
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
    return this.http.get<Chat[]>(
      `/chat/findChatByInterlocutor/${intelocutor}`,
      {observe: 'response'}
    );
  }

  getOpenedChat(id: string) {
    return this.http.get<Chat>(`/chat/getChat/${id}`);
  }

  createChat(interlocutorIds: string[]) {
    return this.http.post('/chat/createChat', { interlocutorIds });
  }
}
