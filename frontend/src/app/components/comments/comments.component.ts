import {Component, Input, OnInit} from '@angular/core';
import {CommentsService} from '../../services/comments.service';
import {AuthService} from '../../services/auth.service';
import {ImageViewerService} from '../../services/image-viewer.service';
import {map} from 'rxjs/internal/operators';
import {Image} from "../../models/image";
import {PaginatedComments} from "../../models/paginatedComments";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
// TODO user can open a few comments which must be saved and opened
// TODO update counter for every created comment

  @Input()
  public itemId: string;
  @Input()
  public comments: PaginatedComments;
  @Input()
  public targetModel: string;

  public commentsCounter;
  public isCommentedByMe;

  public isCommentsOpened = false;
  public scrollCallback;
  public modalId = 'modalComments';

  constructor(public commentsService: CommentsService,
              private authService: AuthService,
              private imageViewerService: ImageViewerService) { }

  ngOnInit() {
    // this.commentsService.getCommentsCounter(this.authService.myUser._id, this.itemId)
    //   .subscribe(res => {
    //     this.commentsCounter = res['commentsCounter'];
    //     this.isCommentedByMe = res['isCommentedByMe'];
    //   });
    // comments.isCommentedByMe
    this.commentsCounter = this.comments.count;
    this.isCommentedByMe = this.comments.isCommentedByMe;
    this.scrollCallback = this.nextPage.bind(this);
  }

/*  openComments() {
    if (!this.isOpened) {
        this.commentsService.getComments(this.itemId, 10, 0)
          .subscribe (res => {
            this.isOpened = true;
            if (this.commentsService.comments.length === this.commentsCounter) {
              // this.commentsService.addCommentListener(this.itemId);
            }
          });
    } else {
      // this.commentsService.removeCommentListener(this.itemId);
      // this.commentsService.destroy();
      this.isOpened = false;
    }
  }*/

  commentsModal(isCommentsOpened: boolean) {
    if (!isCommentsOpened) {
      this.commentsService.removeCommentListener(this.itemId);
      this.commentsService.destroy();
    }
    this.isCommentsOpened = isCommentsOpened;
  }

  nextPage(maxCount: number, currentPage: number) {
    return this.commentsService.getComments(this.itemId, maxCount, currentPage)
      .pipe(
        map(res => {
          // this.blogService.blog = this.blogService.blog.concat(res);
          if (this.commentsService.comments.length === this.commentsCounter) {
            this.commentsService.addCommentListener(this.itemId);
          }
          return res;
        })
      );
  }

  openImageViewer(images: Image[], index: number) {
    this.imageViewerService.openImageViewer(images, index);
  }
}
