import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Blog} from '../models/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  public blog: Blog[] = [];

  constructor(private http: HttpClient) { }

  getBlog(userId) {
    return this.http.get<Blog[]>(`/blogs/getBlog/${userId}`)
      .subscribe( res =>
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
    this.http.delete(`/blogs/deletePost/${postId}`)
      .subscribe(res => {
        this.blog = this.blog.filter(item => item._id !== res._id);
      });
  }
}
