import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { filter, take } from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';
import { SseService } from './services/sse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private sseService: SseService
  ) {}

  ngOnInit() {

    this.authService.myUserSubject
      .pipe(
        filter(user => !!user),
        take(1)
      ).subscribe(myUser => {
        

        // this.sseService.subscribeOnImcomingMessages();
      });
  }
}
