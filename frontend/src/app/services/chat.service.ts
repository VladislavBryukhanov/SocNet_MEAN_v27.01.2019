import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(environment.hostUrl, { path: '/chat' } );
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

  fetchChatList() {
    return this.http.get<Chat[]>('/getChatList');
  }


  sendMessage() {

  }
}
