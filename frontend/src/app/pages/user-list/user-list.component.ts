import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/user';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input()
  public isModal;
  @Input()
  private userSelectionMethod;

  public users: User[] = [];

  private currentPage = 0;
  public scrollCallback;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    if (!this.userSelectionMethod) {
      this.userSelectionMethod = this.usersService.getUserList.bind(this.usersService);
    }
    this.scrollCallback = this.nextPage.bind(this);
  }

  nextPage(maxCount: number) {
    return this.userSelectionMethod(maxCount, this.currentPage)
      .pipe(
        map((res: User[]) => {
          this.users = this.users.concat(res['data']);
          this.currentPage++;
          return res;
        }));
  }
}
