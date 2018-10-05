import {Component, Input, OnInit} from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {ActivatedRoute} from '@angular/router';
import {Blog} from '../../models/blog';
import {AuthService} from '../../services/auth.service';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  @Input()
  public isMyPage: boolean;
  public editFormOpened: string;
  public blog: Blog[] = [];
  public modalId = 'confirmPostRemoving';
  private postId: string;

  constructor(public blogService: BlogService,
              private router: ActivatedRoute,
              public authService: AuthService,
              public modalService: ModalService) { }

  ngOnInit() {
    this.blogService.getBlog(this.router.snapshot.params['id']);
  }

  editPost(id: string) {
    this.editFormOpened = id;
  }

  closeEditForm() {
    this.editFormOpened = null;
  }

  deletePost() {
    this.blogService.deletePost(this.postId);
    this.postId = null;
    this.modalService.close(this.modalId);
  }

  confirmRemoving(postId: string) {
    this.postId = postId;
    this.modalService.open(this.modalId);
  }
}
