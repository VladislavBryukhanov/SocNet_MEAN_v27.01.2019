import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { filter, take } from 'rxjs/internal/operators';
import { SseService } from './services/sse.service';
import { MessageNotification } from './models/chat';
import { ImagePathPipe } from './pipes/image-path.pipe';
import { ImageResizerPipe } from './pipes/image-resizer.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private sseService: SseService,
    private imagePathPipe: ImagePathPipe,
    private imageResizerPipe: ImageResizerPipe
  ) {}

  ngOnInit() {
    this.authService.myUserSubject
      .pipe(
        filter(user => !!user),
        take(1)
      ).subscribe(myUser => {
        const { $messageEvent } = this.sseService.subscribeOnImcomingMessages();
        $messageEvent.subscribe(
          ({ chatId, message }: { chatId: string, message: MessageNotification }) => {
            const { textContent, user } = message;
            const resizedIcon = this.imageResizerPipe.transform(user.avatar, 'min');
            const iconPath = this.imagePathPipe.transform(resizedIcon);

            this.sendNotifacation(textContent, user.username, iconPath);
          });
      });
  }

  sendNotifacation(title, content, icon) {
    Notification.requestPermission()
      .then(permission => {
        if (permission === 'granted') {
          const notification = new Notification(
            title,
            { body: content, icon }
          );
          notification.onclick = () => {
            console.log('click');
          }
        }
      });
  }
}
