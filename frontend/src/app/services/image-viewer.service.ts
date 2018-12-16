import { Injectable } from '@angular/core';
import {ModalService} from './modal.service';
import {Image} from '../../../../frontend/src/app/models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageViewerService {

  public imagesList: Image[] = [];
  public currentImage: Image = new Image('', ''); // TODO LoadAnimation
  public modalImageViewerId = 'imageViewer';
  private openedImageIndex;

  constructor(private modalService: ModalService) { }

  openImageViewer(images: Image[], index: number) {
    this.imagesList = images;
    this.openedImageIndex = index;
    if (this.imagesList.length > 0) {
      this.currentImage = this.imagesList[this.openedImageIndex];
    }
    this.modalService.open(this.modalImageViewerId);
  }

  nextImage() {
    const nextImg = this.imagesList[++this.openedImageIndex];
    if (!nextImg) {
      this.openedImageIndex = 0;
    }
    this.currentImage = this.imagesList[this.openedImageIndex];
  }

  prevImage() {
    const prevImg = this.imagesList[--this.openedImageIndex];
    if (!prevImg) {
      this.openedImageIndex = this.imagesList.length - 1;
    }
    this.currentImage = this.imagesList[this.openedImageIndex];
  }

}
