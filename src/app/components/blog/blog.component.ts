import {Component, Input, OnInit} from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {ActivatedRoute} from '@angular/router';
import {Blog} from '../../models/blog';
import {AuthService} from '../../services/auth.service';

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

  constructor(public blogService: BlogService, private router: ActivatedRoute, public authService: AuthService) { }

  ngOnInit() {
    this.blogService.getBlog(this.router.snapshot.params['id']);
  }

  deletePost(id: string) {
    this.blogService.deletePost(id);
  }

  editPost(id: string) {
    this.editFormOpened = id;
  }

  closeEditForm() {
    this.editFormOpened = null;
  }
}
