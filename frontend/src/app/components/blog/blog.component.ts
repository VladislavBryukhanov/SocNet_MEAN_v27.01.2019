import {Component, Input} from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {AuthService} from '../../services/auth.service';
import {ModalService} from '../../services/modal.service';
import {ImageViewerService} from '../../services/image-viewer.service';
import {Image} from "../../models/image";
import {TargetModel} from "../../models/constants";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  @Input()
  public isMyPage: boolean;

  private postId: string;
  public editFormOpened: string;
  public modalRemovingId = 'confirmPostRemoving';

  public targetModel = TargetModel;

  constructor(public blogService: BlogService,
              public authService: AuthService,
              public imageViewerService: ImageViewerService,
              public modalService: ModalService) { }

  editPost(id: string) {
    this.editFormOpened = id;
  }

  closeEditForm() {
    this.editFormOpened = null;
  }

  deletePost() {
    this.blogService.deletePost(this.postId);
    this.postId = null;
    this.modalService.close(this.modalRemovingId);
  }

  confirmRemoving(postId: string) {
    this.postId = postId;
    this.modalService.open(this.modalRemovingId);
  }

  openImageViewer(images: Image[], index: number) {
    this.imageViewerService.openImageViewer(images, index);
  }
}
