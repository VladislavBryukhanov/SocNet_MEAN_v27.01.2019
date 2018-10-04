import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Blog} from '../models/blog';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  public blog: Blog[] = [];

  constructor(private http: HttpClient) { }

  getPost(postId): Observable<Blog> {
    return this.http.get<Blog>(`/blogs/getPost/${postId}`);
  }

  getBlog(userId) {
    return this.http.get<Blog[]>(`/blogs/getBlog/${userId}`)
      .subscribe( (res: Blog[]) =>
        this.blog = res.reverse()
      );
  }

  publishPost(post: FormData) {
    this.http.post('/blogs/addPost', post)
      .subscribe(res => {
        this.blog.unshift(<Blog>res);
      });
  }

  deletePost(postId: string) {
    this.http.delete<Blog>(`/blogs/deletePost/${postId}`)
      .subscribe((res: Blog) => {
        this.blog = this.blog.filter(item => item._id !== res._id);
      });
  }

  editPost(post: FormData) {
    this.http.put('/blogs/editPost', post)
      .subscribe((res: Blog) => {
        const index = this.blog.findIndex(item => item._id === res._id);
        this.blog[index] = res;
      });
  }
}
