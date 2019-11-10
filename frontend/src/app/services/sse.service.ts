import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { fromEvent, combineLatest } from 'rxjs';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  get options() {
    return {
      headers: {
        authorization: this.authService.authToken
      }
    };
  }

  constructor(private authService: AuthService) { }

  sseEventHandler(path) {
    const eventSource = new EventSourcePolyfill(
      `${environment.hostUrl}/sse/${path}`,
      this.options
    );

    return {
      onMessage: fromEvent(eventSource, 'message').pipe(
        map((res) => JSON.parse(res['data']))
      ),
      onOpen: fromEvent(eventSource, 'open'),
      onError: fromEvent(eventSource, 'error'),
    };
  }

  subscribeOnImcomingMessages() {
    const { onMessage } = this.sseEventHandler(`/incomingMessages`);

    onMessage.subscribe((message) => {
      console.log(message);
    });
  }

  subscribeOnChatCreation() {
    return this.sseEventHandler(`/chatCreated`);
  }
}
