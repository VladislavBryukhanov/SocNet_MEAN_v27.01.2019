import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {CommentsService} from '../../services/comments.service';
import {ImageViewerService} from '../../services/image-viewer.service';
import {map} from 'rxjs/internal/operators';
import {Image} from '../../models/image';
import {PaginatedComments} from '../../models/paginatedComments';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {
// TODO user can open a few comments which must be saved and opened
// TODO update counter for every created comment

  @Input()
  public itemId: string;
  @Input()
  public comments: PaginatedComments;
  @Input()
  public targetModel: string;

  public commentsCounter: number;
  public isCommentedByMe: boolean;

  public isCommentsOpened = false;
  public scrollCallback: Function;
  public modalId = 'modalComments';

  private subscription: Subscription;

  constructor(
    public commentsService: CommentsService,
    private imageViewerService: ImageViewerService
  ) { }

  ngOnInit() {
    this.commentsCounter = this.comments.count;
    this.isCommentedByMe = this.comments.isCommentedByMe;
    this.scrollCallback = this.nextPage.bind(this);
  }

  ngOnDestroy() {
    this.unsubscribeFromUpdates();
  }

  commentsModal(isCommentsOpened: boolean) {
    if (!isCommentsOpened) {
      this.unsubscribeFromUpdates();
    } else if (!this.commentsCounter) {
      this.subscribeOnRealtimeUpdates();
    }
    this.isCommentsOpened = isCommentsOpened;
  }

  nextPage(maxCount: number, currentPage: number) {
    return this.commentsService.getComments(this.itemId, this.targetModel, maxCount, currentPage)
      .pipe(
        map(res => {
          if (this.commentsService.comments.value.length === this.commentsCounter) {
            this.subscribeOnRealtimeUpdates();
          }
          return res;
        })
      );
  }

  subscribeOnRealtimeUpdates() {
    this.commentsService.addCommentListener(this.itemId);

    this.subscription = this.commentsService.comments.subscribe(comments => {
      this.commentsCounter = comments.length;
      // TODO update isCommentedByMe
      // this.isCommentedByMe
    });
  }
  unsubscribeFromUpdates() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.commentsService.removeCommentListener(this.itemId);
    this.commentsService.destroy();
  }

  openImageViewer(images: Image[], index: number) {
    this.imageViewerService.openImageViewer(images, index);
  }
}
