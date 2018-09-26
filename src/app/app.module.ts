import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RoutingModule} from './modules/routing/routing.module';
import {AuthInterceptor} from './modules/authInterceptor';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ImagePathPipe } from './pipes/image-path.pipe';

@NgModule({
  declarations: [
    ImagePathPipe,
    AppComponent,
    SignInComponent,
    SignUpComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
