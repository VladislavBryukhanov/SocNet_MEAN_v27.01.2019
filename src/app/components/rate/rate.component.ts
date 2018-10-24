import {Component, Input, OnInit} from '@angular/core';
import {RateService} from '../../services/rate.service';
import {AuthService} from '../../services/auth.service';
import {ItemsType, Rate} from '../../models/rate';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

  @Input()
  public itemId: string;

  public likeCounter: number;
  public dislikeCounter: number;

  constructor(private rateService: RateService, private authService: AuthService) { }

  ngOnInit() {
    this.getPostRate();
  }

  likePost() {
    this.rateService.postRate(new Rate(
      this.authService.myUser._id,
      true,
      ItemsType.post,
      this.itemId
    ))
      .subscribe(res => {
        if (res.lastState === null) {
          this.likeCounter++;
        } else if (res.lastState === false) {
          this.likeCounter++;
          this.dislikeCounter--;
        } else {
          this.likeCounter--;
        }
      });
  }

  dislikePost() {
    this.rateService.postRate(new Rate(
      this.authService.myUser._id,
      false,
      ItemsType.post,
      this.itemId
    ))
      .subscribe(res => {
        if (res.lastState === null) {
          this.dislikeCounter++;
        } else if (res.lastState === false) {
          this.likeCounter--;
          this.dislikeCounter++;
        } else {
          this.likeCounter--;
        }
      });
  }

  getPostRate() {
    this.rateService.getRate(ItemsType.post, this.itemId)
      .subscribe(res => {
          this.likeCounter = res.filter((item: Rate) => item.isPositive).length;
          this.dislikeCounter = res.length - this.likeCounter;
      }, err => {
        if (err.status === 404) {
          this.likeCounter = 0;
          this.dislikeCounter = 0;
        }
      });
  }

}
