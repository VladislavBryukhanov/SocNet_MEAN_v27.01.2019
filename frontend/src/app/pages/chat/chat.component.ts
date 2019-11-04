import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalMessage, Chat } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { mergeMap, filter } from 'rxjs/internal/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

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
  ];

  chatList: Chat[] = [];
  messageContent = '';
  openedChat?: Chat;
  initDialog: boolean;
  loading = true;
  subscriptions: Subscription[] = [];
  interlocutor: string;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

// TODO pass user as param and display it in header even before message sendint
// TODO router error when route with query params

  ngOnInit() {
    this.subscriptions.push(
      this.chatService
        .getChatList(true)
        .subscribe(chatList => {
          this.chatList = chatList.map(this.displayableChat);
        })
    );

    this.subscriptions.push(
      this.route.params.pipe(
        filter(params => params.chatId),
        mergeMap((params) => this.chatService.getOpenedChat(params.chatId))
      ).subscribe((chat: Chat) => {
        this.loading = false;
        this.openedChat = this.displayableChat(chat);
      })
    );

    this.subscriptions.push(
      this.route.queryParams.pipe(
        filter(params => params.interlocutor),
        mergeMap((params) => {
          this.interlocutor = params.interlocutor;
          return this.chatService.findChatByInterlocutor(params.interlocutor);
        })
      ).subscribe((chatList: Chat[]) => {
        const chat = chatList.find((item: Chat) => item.users.length === 2);
        this.loading = false;

        if (!chat || !chat._id) {
          return this.initDialog = true;
        }

        this.onOpenChat(chat);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  displayableChat = (chat: Chat) => {
    const interlocutor = chat.users.find(
      user => user._id !== this.authService.myUser._id
    );

    return {
      _id: chat._id,
      avatar: interlocutor.avatar,
      name: interlocutor.username,
      users: chat.users
    };
  }

  onOpenChat(chat: Chat) {
    this.router.navigate([ `/chat/${chat._id}` ]);
  }

  async onSendMessage() {
    if (this.initDialog) {
      const interlocutors = [
        this.authService.myUser._id,
        this.interlocutor
      ];

      this.subscriptions.push(
        this.chatService
          .createChat(interlocutors)
          .subscribe((chat: Chat) => {
            this.initDialog = false;
            this.openedChat = this.displayableChat(chat);

            this.chatList.push(this.openedChat);
            this.onOpenChat(chat);
          })
      );
    }
    const message: LocalMessage = {
      textContent: this.messageContent,
      sender: this.authService.myUser._id,
      attachedFiles: []
    };
    this.chatService.sendMessage(message);
  }
}
