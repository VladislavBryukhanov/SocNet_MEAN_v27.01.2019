import { Component, OnInit } from '@angular/core';
import {BlogService} from '../../services/blog.service';

@Component({
  selector: 'app-blog-constructor',
  templateUrl: './blog-constructor.component.html',
  styleUrls: ['./blog-constructor.component.scss']
})
export class BlogConstructorComponent implements OnInit {

  private attachedFiles: File[] = [];
  public textContent: string;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
  }

  publishPost() {
    const newPost = new FormData();
    newPost.append('content', this.textContent);

    console.log(this.attachedFiles);
    this.attachedFiles.forEach(file =>
      newPost.append('files', file));
    this.blogService.publishPost(newPost);
  }

  onFilesAttached(e) {
    this.attachedFiles = Array.from(e.target.files);
  }

}
