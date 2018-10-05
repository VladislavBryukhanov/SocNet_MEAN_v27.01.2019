import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals = [];

  constructor() { }

  add(modal) {
    this.modals.push(modal);
  }

  remove(id) {
    this.modals.filter(x => x.id !== id);
  }

  open(id) {
    const modal: any = this.modals.find(x => x.id === id);
    modal.open();
  }

  close(id) {
    const modal: any = this.modals.find(x => x.id === id);
    modal.close();
  }
}
