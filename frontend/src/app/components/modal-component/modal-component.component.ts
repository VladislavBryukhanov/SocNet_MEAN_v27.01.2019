import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss']
})
export class ModalComponentComponent implements OnInit, OnDestroy {

  @Input()
  id: string;
  @Input()
  disposable: boolean;
  @Output()
  userListModal = new EventEmitter<boolean>();

  private element;

  constructor(private modalService: ModalService, el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.modalService.add(this);
    document.body.appendChild(this.element);
    this.element.addEventListener('click', e => {
      if (e.target.className === 'modalBackground') {
        this.close();
      }
    });

    if (!this.disposable) {
      this.close();
    }
  }

  ngOnDestroy() {
    this.modalService.remove(this.id);
    this.element.remove();
    // document.body.removeChild(this.element);
  }

  open() {
    this.element.style.display = 'block';
  }

  close() {
    if (this.disposable) {
      this.userListModal.emit(false);
    } else {
      this.element.style.display = 'none';
    }
  }

}
