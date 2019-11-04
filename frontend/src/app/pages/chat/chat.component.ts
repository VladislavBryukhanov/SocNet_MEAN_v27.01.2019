import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../../models/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatList = [
    {
      avatar: {
        fileName: "avatar-9c8db5a0-fed6-11e9-8e36-f3b5deee08a9.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-9c8db5a0-fed6-11e9-8e36-f3b5deee08a9.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-9c8db5a0-fed6-11e9-8e36-f3b5deee08a9.png",
        filePath: "avatars/"
      },
      name: 'Test chat'
    },
    {
      avatar: {
        fileName: "avatar-9c8db5a0-fed6-11e9-8e36-f3b5deee08a9.png",
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

  messageContent: string = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.chatService
      .getChatList()
      .toPromise();

    const interlocutor = this.route.snapshot.params['interlocutor'];
    console.log(interlocutor);
  }

  onOpenChat(chat) {

  }

  onSendMessage() {
    const message: Partial<Message> = {
      textContent: this.messageContent
    };
    this.chatService.sendMessage(message);
  }

}
