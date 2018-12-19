import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Blog} from '../models/blog';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  get blog(): Blog[] {
    return this._blog;
  }

  set blog(value: Blog[]) {
    this._blog = value;
  }

  private _blog: Blog[] = [];

  constructor(private http: HttpClient) { }

  getPost(postId): Observable<Blog> {
    return this.http.get<Blog>(`/blogs/getPost/${postId}`);
  }

  getBlog(userId: string, limit: number = 1, currentPage: number = 0): Observable<Blog[]> {
    return this.http.get<Blog[]>(`/blogs/getBlog/${userId}&${limit}&${currentPage * limit}`);
  }

  publishPost(post: FormData) {
    this.http.post('/blogs/addPost', post)
      .subscribe(res => {
        this._blog.unshift(<Blog>res);
      });
  }

  deletePost(postId: string) {
    this.http.delete<Blog>(`/blogs/deletePost/${postId}`)
      .subscribe((res: Blog) => {
        this._blog = this._blog.filter(item => item._id !== res._id);
      });
  }

  editPost(post: FormData) {
    this.http.put('/blogs/editPost', post)
      .subscribe((res: Blog) => {
        const index = this._blog.findIndex(item => item._id === res._id);
        this._blog[index] = res;
      });
  }

  destroy() {
    this.blog = [];
  }
}
