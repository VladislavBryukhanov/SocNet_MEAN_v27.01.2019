import { UsersService } from './../../services/users.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalMessage, Chat, Message } from '../../models/chat';
import { AuthService } from '../../services/auth.service';
import { Subscription, forkJoin, of, throwError } from 'rxjs';
import { mergeMap, filter, concatMap, tap, take, catchError } from 'rxjs/internal/operators';
import { SseService } from 'src/app/services/sse.service';
import { HttpResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  chatList: Chat[] = [];
  chatContent: Message[] = [];
  messageContent = '';
  openedChat?: Partial<Chat>;
  initDialog: boolean;
  loading = true;
  subscriptions: Subscription[] = [];
  interlocutor: string;

  eventSource;

  // send message after chat creating and user connection to this new chat by socket

  constructor(
    private chatService: ChatService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private sseService: SseService
  ) { }

// TODO pass user as param and display it in header even before message sendint
// TODO router error when route with query params

  ngOnInit() {
    const { source, $messageEvent } = this.sseService.subscribeOnChatCreation();
    this.eventSource = source;

    this.subscriptions.push(
      $messageEvent.subscribe(newChat => {
        const chat = this.displayableChat(newChat);
        this.chatList.push(chat);
      })
    );

    this.subscriptions.push(
      this.chatService.getChatList(true)
        .subscribe(chatList => {
          this.chatList = chatList.map(this.displayableChat);
        })
    );

    this.subscriptions.push(
      this.route.params.pipe(
        filter(params => params.chatId),
        mergeMap((params) => this.chatService.getOpenedChat(params.chatId)),
        mergeMap((chat: Chat) => {
          this.loading = false;
          this.openedChat = this.displayableChat(chat);

          return this.chatService.subscribeOnChat(chat._id);
        })
      ).subscribe((messages: Message[]) =>
        this.chatContent = messages
      )
    );

    this.subscriptions.push(
      this.route.queryParams.pipe(
        filter(params => params.interlocutor),
        mergeMap((params) => {
          this.interlocutor = params.interlocutor;

          return this.chatService.findChatByInterlocutor(params.interlocutor);
        })
      ).subscribe(async(response: HttpResponse<Chat[]>) => {
        this.loading = false;

        // if interlocutor is not exists ... create chat with it
        if (response.status === 204) {
          this.userService.getUserById(this.interlocutor)
            .toPromise()
            .then(user => this.openedChat = {
              avatar: user.avatar,
              name: user.username,
            });

          return this.initDialog = true;
        }

        const chat = response.body.find((item: Chat) => item.users.length === 2);
        this.onOpenChat(chat);
      })
    );
  }

  ngOnDestroy() {
    this.eventSource.close();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.unsubscribeFromChat();
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

  isMyMessage(message: Message) {
    return message.user === this.authService.myUser._id;
  }

  onOpenChat(chat: Chat) {
    // Ангулар роутер почему-то не игнорирует переход на такой же роут после создания чата (и дестроит а далее инитит по новой один и
    // тот же компонент, баг воспроизводится только для создателя чата), хотя это предусматривается дефолтным значением 
    // onSameUrlNavigation, проверял на Ангулар 6 и на Ангулар 8, идентичный баг
    if (this.router.url === `/chat/${chat._id}`) {
      return;
    }

    this.router.navigate([ `/chat/${chat._id}` ]);
  }

  createChat(callback: Function) {
    const interlocutors = [
      this.authService.myUser._id,
      this.interlocutor
    ];

    let newChat;
    this.subscriptions.push(
      this.chatService
        .createChat(interlocutors)
        .pipe(
          mergeMap((chat: Chat) => {
            newChat = chat;
            return this.chatService.subscribeOnChat(chat._id);
          }),
          take(1)
        ).subscribe(async (messages: Message[]) => {
          await callback();
          this.onOpenChat(newChat);
        })
    );
  }

  async onSendMessage() {
    const sendMessage = () => {
      const message: LocalMessage = {
        textContent: this.messageContent,
        sender: this.authService.myUser._id,
        attachedFiles: []
      };

      this.messageContent = '';
      return this.chatService.sendMessage(message);
    };

    if (this.initDialog) {
      return this.createChat(sendMessage);
    } else {
      sendMessage();
    }
  }
}
