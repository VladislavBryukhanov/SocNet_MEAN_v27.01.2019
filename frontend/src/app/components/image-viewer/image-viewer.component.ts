import {Component} from '@angular/core';
import {ImageViewerService} from '../../services/image-viewer.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {

  constructor(public imageViewerService: ImageViewerService) { }

  nextImage() {
    this.imageViewerService.nextImage();
  }

  prevImage() {
    this.imageViewerService.prevImage();
  }

}
