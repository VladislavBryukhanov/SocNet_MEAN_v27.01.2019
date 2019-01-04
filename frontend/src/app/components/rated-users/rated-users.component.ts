import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {User} from '../../models/user';
import {RateService} from '../../services/rate.service';

@Component({
  selector: 'app-rated-users',
  templateUrl: './rated-users.component.html',
  styleUrls: ['./rated-users.component.scss']
})
export class RatedUsersComponent implements OnChanges {

  @Input()
  public targetModel: string;
  @Input()
  public itemId: string;
  @Input()
  public isPositive: boolean;
  @Input()
  public rateCounter: number;
  @Input()
  public action: string;

  public users: User[];
  public modalId = 'modalUserList';
  public isUserListOpened = false;
  public userSelectionMethod;

  constructor(private rateService: RateService) {
    this.userSelectionMethod = (maxCount, currentPage) => {
      return this.rateService.getRatedUsers(this.itemId, this.targetModel, this.isPositive, maxCount, currentPage);
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userSelectionMethod(5, 0)
      .subscribe((res: User[]) => {
        this.users = res['data'];
      });
  }

  userListModal(isUserListOpened: boolean) {
    this.isUserListOpened = isUserListOpened;
  }

}
