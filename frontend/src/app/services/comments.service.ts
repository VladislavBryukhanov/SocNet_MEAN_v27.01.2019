import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs/index';
import {Comment} from '../models/comment';
import * as io from 'socket.io-client';
import {map} from 'rxjs/internal/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private socket;
  public comments: BehaviorSubject<Comment[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  addCommentListener(itemId: string) {
    this.socket = io(environment.hostUrl, { path: '/comments_soc'});

    this.socket.emit('joinCommentsRoom', itemId);
    this.socket.on('commentAdded', (comment: Comment) => {
      this.comments.next([
        ...this.comments.value,
        comment
      ]);
    });
  }
  removeCommentListener(itemId: string) {
    if (this.socket) {
      this.socket.close();
    }
  }

  // getCommentsCounter(userId: string, itemId: string) {
  //   return this.http.get(`/comments/getCommentsCounter/${itemId}&${userId}`);
  // }

  getComment(commentId): Observable<Comment> {
    return this.http.get<Comment>(`/comments/getComment/${commentId}`);
  }

  getComments(itemId: string, targetModel: string, limit: number = 1, currentPage: number = 0) {
    return this.http.get<Comment[]>(`/comments/getComments/${itemId}&${targetModel}&${limit}&${currentPage * limit}`)
      .pipe(
        map(res => {
          this.comments.next([
            ...this.comments.value,
            ...res['data']
          ]);
          return res;
        })
      );
  }

  addComment(comment: FormData, targetModel: string, itemId: string) {
    comment.append('itemId', itemId);
    comment.append('targetModel', targetModel);
    //todo handleMe
    this.http.post('/comments/addComment', comment).toPromise();
  }

  deleteComment(commentId: string) {
    this.http.delete<Comment>(`/comments/deleteComment/${commentId}`)
      .subscribe((res: Comment) => {
        const fiteredComments = this.comments.value.filter(
          item => item._id !== res._id
        );
        this.comments.next(fiteredComments);
      });
  }

  editComment(comment: FormData) {
    this.http.put('/comments/editComment', comment)
      .subscribe((res: Comment) => {
        const editedComments = this.comments.value;
        const index = editedComments.findIndex(item => item._id === res._id);
        editedComments[index] = res;

        this.comments.next(editedComments);
      });
  }

  destroy() {
    this.comments.next([]);
  }
}
