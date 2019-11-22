import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/internal/operators';

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
      source: eventSource,
      $messageEvent: fromEvent(eventSource, 'message').pipe(
        filter(result => !!result['data']),
        map((res) => JSON.parse(res['data']))
      ),
      $openEvent: fromEvent(eventSource, 'open'),
      $errorEvent: fromEvent(eventSource, 'error'),
    };
  }

  subscribeOnImcomingMessages() {
    return this.sseEventHandler(`/incomingMessages`);
  }

  subscribeOnChatCreation() {
    return this.sseEventHandler(`/chatCreated`);
  }
}
