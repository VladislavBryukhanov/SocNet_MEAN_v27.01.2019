import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Comment} from '../models/comment';
import {AuthInterceptor} from '../modules/authInterceptor';
import * as io from 'socket.io-client';
import {map} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  get comments(): Comment[] {
    return this._comments;
  }

  set comments(value: Comment[]) {
    this._comments = value;
  }

  private _comments: Comment[] = [];
  private socket = io(AuthInterceptor.hostUrl, { path: '/comments_soc'});

  addCommentListener(itemId: string) {
    this.socket.emit('joinCommentsRoom', itemId);
    this.socket.on('commentAdded', (comment: Comment) => {
      this._comments.unshift(comment);
    });
  }
  removeCommentListener(itemId: string) {
    // this.socket.close();
    console.log('TODO Closing');
  }

  getCommentsCounter(userId: string, itemId: string) {
    return this.http.get(`/comments/getCommentsCounter/${itemId}&${userId}`);
  }

  getComment(commentId): Observable<Comment> {
    return this.http.get<Comment>(`/comments/getComment/${commentId}`);
  }

  getComments(itemId: string, limit: number = 1, currentPage: number = 0) {
    return this.http.get<Comment[]>(`/comments/getComments/${itemId}&${limit}&${currentPage * limit}`)
      .pipe(
        map(res => {
            this._comments = this._comments.concat(res['data']);
            return res;
          }
        )
      );
  }

  addComment(comment: FormData, itemId: string) {
    comment.append('itemId', itemId);
    this.http.post('/comments/addComment', comment)
      .subscribe(res => {
        this._comments.push(<Comment>res);
      });
  }

  deleteComment(commentId: string) {
    this.http.delete<Comment>(`/FormData/deletePost/${commentId}`)
      .subscribe((res: Comment) => {
        this._comments = this._comments.filter(item => item._id !== res._id);
      });
  }

  editComment(comment: FormData) {
    this.http.put('/FormData/deleteComment', comment)
      .subscribe((res: Comment) => {
        const index = this._comments.findIndex(item => item._id === res._id);
        this._comments[index] = res;
      });
  }

  destroy() {
    this._comments = [];
  }
}
