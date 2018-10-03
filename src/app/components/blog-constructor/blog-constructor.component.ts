import { Component, OnInit } from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-blog-constructor',
  templateUrl: './blog-constructor.component.html',
  styleUrls: ['./blog-constructor.component.scss']
})
export class BlogConstructorComponent implements OnInit {

  public formGroup: FormGroup;
  private attachedFiles: File[] = [];

  constructor(private blogService: BlogService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      files: [],
      textContent: ''
    });
  }

  publishPost() {
    const textContent = this.formGroup.get('textContent').value;

    const newPost = new FormData();
    newPost.append('content', textContent);

    this.attachedFiles.forEach(file =>
      newPost.append('files', file));

    if (this.attachedFiles.length > 0 || textContent.length > 0) {
      this.blogService.publishPost(newPost);
      this.formGroup.reset();
    }
  }

  onFilesAttached(e) {
    this.attachedFiles = Array.from(e.target.files);
  }

}
