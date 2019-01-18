import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Blog} from '../../models/blog';
import {CommentsService} from '../../services/comments.service';
import {Observable} from 'rxjs/index';
import {Image} from "../../models/image";

// it component allows build posts or comments

@Component({
  selector: 'app-blog-constructor',
  templateUrl: './blog-constructor.component.html',
  styleUrls: ['./blog-constructor.component.scss']
})
export class BlogConstructorComponent implements OnInit {

  @Input()
  public isComment;
  @Input()
  private itemId;

  @Output()
  public closeEditForm = new EventEmitter<void>();
  @Input()
  public editId: string;
  public existsPost: Blog;
  public textarea;

  public formGroup: FormGroup;
  public attachedFiles: File[] = [];
  public filesPreview = [];

  // public constructorService = {
  //   getItem: (id: string): Observable<any> => {},
  //   editItem: (data: FormData) => {},
  //   publishItem: (data: FormData) => {},
  // };
  private getItem;
  private editItem;
  private publishItem;

  constructor(private blogService: BlogService,
              private formBuilder: FormBuilder,
              private elemRef: ElementRef,
              private commentsService: CommentsService) { }

  // TODO comment and blog service interface implements

  ngOnInit() {
    if (!this.isComment) {
      this.getItem = this.blogService.getPost.bind(this.blogService);
      this.editItem = this.blogService.editPost.bind(this.blogService);
      this.publishItem = this.blogService.publishPost.bind(this.blogService);
    } else {
      this.getItem = this.commentsService.getComment.bind(this.commentsService);
      this.editItem = this.commentsService.editComment.bind(this.commentsService);
      this.publishItem = (data: FormData) => this.commentsService.addComment(data, this.itemId);
    }

    this.formGroup = this.formBuilder.group({
      files: [],
      textContent: ''
    });
    this.textarea = this.elemRef.nativeElement.querySelector('textarea');
    if (this.editId) {
      this.getItem(this.editId)
        .subscribe((res: Blog) => {
            this.formGroup.patchValue({'textContent': res.textContent});
            this.textContentChanged();
            this.existsPost = res;
          }
        );
    }
  }

  editPost(newPost: FormData, textContent: string) {
    newPost.append('_id', this.existsPost._id);
    newPost.append('content', textContent);
    this.existsPost.attachedFiles.forEach((file: Image) =>
      newPost.append('existsFiles[]', file._id));

    if (this.existsPost.attachedFiles.length > 0 || textContent.trim().length > 0) {
      this.editItem(newPost);
      //TODO editForm sloded before changes and subscribe is not solution because it will worked before rerendering
      this.closeEditForm.emit();
    }
  }

  publishPost() {
    const newPost = new FormData();
    this.attachedFiles.forEach(file =>
      newPost.append('files', file));
    const textContent = this.formGroup.get('textContent').value;
    if (this.editId) {
      this.editPost(newPost, textContent);
    } else {
      if (textContent) {
        newPost.append('content', textContent);
      }
      if (this.attachedFiles.length > 0 || textContent.trim().length > 0) {
        this.publishItem(newPost);
      }
    }

    this.attachedFiles = [];
    this.filesPreview = [];
    this.formGroup.reset();
    this.textarea.style.height = '140 px';
  }

  textContentChanged() {
    if (this.textarea.scrollHeight > this.textarea.clientHeight) {
      this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
  }

  onFilesAttached(e) {
    const newFiles: File[] = Array.from(e.target.files);
    newFiles.forEach(file => {
      this.getFileUrl(file);
    });
  }

  async getFileUrl(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = _ => {
      this.attachedFiles.push(file);
      this.filesPreview.push(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  removeFileLocal(index: number) {
    this.attachedFiles.splice(index, 1);
    this.filesPreview.splice(index, 1);
  }

  removeFileExists(img: Image) {
    this.existsPost.attachedFiles = this.existsPost.attachedFiles.filter(item => item !== img);
  }

}
