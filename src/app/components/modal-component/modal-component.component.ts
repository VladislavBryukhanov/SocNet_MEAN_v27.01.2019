import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss']
})
export class ModalComponentComponent implements OnInit, OnDestroy {

  @Input()
  id: string;
  private element;

  constructor(private modalService: ModalService, el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.modalService.add(this);
    document.body.appendChild(this.element);

    this.close();
    this.element.addEventListener('click', e => {
      if (e.target.className === 'modalBackground') {
        this.close();
      }
    });
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
    this.element.style.display = 'none';
  }

}
