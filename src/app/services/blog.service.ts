import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  publishPost(post: FormData) {
    this.http.post('/blogs/addPost', post)
      .subscribe(res => {
        console.log(res);
      });
  }
}
