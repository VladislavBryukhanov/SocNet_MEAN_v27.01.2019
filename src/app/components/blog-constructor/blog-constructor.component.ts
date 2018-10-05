import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Blog} from '../../models/blog';

@Component({
  selector: 'app-blog-constructor',
  templateUrl: './blog-constructor.component.html',
  styleUrls: ['./blog-constructor.component.scss']
})
export class BlogConstructorComponent implements OnInit {

  @Output()
  public closeEditForm = new EventEmitter<void>();
  @Input()
  public editId: string;
  public existsPost: Blog;

  public formGroup: FormGroup;
  public attachedFiles: File[] = [];
  public filesPreview = [];

  constructor(private blogService: BlogService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      files: [],
      textContent: ''
    });

    if (this.editId) {
      this.blogService.getPost(this.editId)
        .subscribe((res: Blog) => {
            this.formGroup.patchValue({'textContent': res.textContent});
            this.existsPost = res;
          }
        );
    }
  }

  editPost(newPost: FormData, textContent: string) {
    newPost.append('_id', this.existsPost._id);
    newPost.append('content', textContent);
    this.existsPost.attachedFiles.forEach(file =>
      newPost.append('existsFiles[]', file));

    if (this.attachedFiles.length > 0 || textContent.trim().length > 0) {
      this.blogService.editPost(newPost);
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
        this.blogService.publishPost(newPost);
      }
    }

    this.attachedFiles = [];
    this.filesPreview = [];
    this.formGroup.reset();
  }

  onFilesAttached(e) {
    const newFiles: File[] = Array.from(e.target.files);
    this.attachedFiles = this.attachedFiles.concat(newFiles);
    newFiles.forEach(file => {
      this.getFileUrl(file);
    });
  }

  async getFileUrl(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = _ => {
      this.filesPreview.push(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  removeFileLocal(index: number) {
    this.attachedFiles.splice(index, 1);
    this.filesPreview.splice(index, 1);
  }

  removeFileExists(url: string) {
    this.existsPost.attachedFiles = this.existsPost.attachedFiles.filter(item => item !== url);
  }

}
