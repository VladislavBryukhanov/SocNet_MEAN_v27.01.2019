import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatList = [
    {
       avatar: {
          fileName: "avatar-f0997740-4196-11e9-9ce7-7d59ffcc8c72.png",
          filePath: "avatars/"
       },
       name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-f0997740-4196-11e9-9ce7-7d59ffcc8c72.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-f0997740-4196-11e9-9ce7-7d59ffcc8c72.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-f0997740-4196-11e9-9ce7-7d59ffcc8c72.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    }
  ];

  chatContent = [
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date() },
    { content: 'lorem ipsum dolor amet', date: new Date(), sentByMe: true },
  ]

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService
      .fetchChatList()
      .toPromise();
  }

  onOpenChat(chat) {
    
  }

}
