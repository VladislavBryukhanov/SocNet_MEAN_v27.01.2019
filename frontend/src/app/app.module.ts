import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from './modules/routing/routing.module';
import { AuthInterceptor } from './modules/authInterceptor';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ImagePathPipe } from './pipes/image-path.pipe';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavBarComponent } from './components/navBar/navBar.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { BlogConstructorComponent } from './components/blog-constructor/blog-constructor.component';
import { BlogComponent } from './components/blog/blog.component';
import { ModalComponentComponent } from './components/modal-component/modal-component.component';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
import {RateComponent} from './components/rate/rate.component';
import {RatedUsersComponent} from './components/rated-users/rated-users.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { CommentsComponent } from './components/comments/comments.component';
import { ImageResizerPipe } from './pipes/image-resizer.pipe';

@NgModule({
  declarations: [
    ImagePathPipe,
    AppComponent,
    SignInComponent,
    SignUpComponent,
    UserListComponent,
    ProfileComponent,
    NavBarComponent,
    EditProfileComponent,
    BlogConstructorComponent,
    BlogComponent,
    ModalComponentComponent,
    InfiniteScrollDirective,
    RateComponent,
    RatedUsersComponent,
    ImageViewerComponent,
    CommentsComponent,
    ImageResizerPipe
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
