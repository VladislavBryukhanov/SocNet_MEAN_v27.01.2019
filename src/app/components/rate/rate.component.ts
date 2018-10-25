import {Component, Input, OnInit} from '@angular/core';
import {RateService} from '../../services/rate.service';
import {AuthService} from '../../services/auth.service';
import {Rate} from '../../models/rate';

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

  public meLike = false;
  public meDislike = false;

  constructor(private rateService: RateService, private authService: AuthService) { }

  ngOnInit() {
    this.getPostRate();
  }

  likePost() {
    this.rateService.postRate(new Rate(
      this.authService.myUser._id,
      true,
      this.itemId
    ))
      .subscribe(res => {
        this.getPostRate();
        // if (res.lastState === null) {
        //   this.likeCounter++;
        // } else if (res.lastState === false) {
        //   this.likeCounter++;
        //   this.dislikeCounter--;
        // } else {
        //   this.likeCounter--;
        // }
      });
  }

  dislikePost() {
    this.rateService.postRate(new Rate(
      this.authService.myUser._id,
      false,
      this.itemId
    ))
      .subscribe(res => {
        this.getPostRate();
        // if (res.lastState === null) {
        //   this.dislikeCounter++;
        // } else if (res.lastState === false) {
        //   this.likeCounter--;
        //   this.dislikeCounter++;
        // } else {
        //   this.likeCounter--;
        // }
      });
  }

  getPostRate() {
    this.rateService.getRate(this.itemId)
      .subscribe(res => {
          this.likeCounter = res.filter((item: Rate) => item.isPositive).length;
          this.dislikeCounter = res.length - this.likeCounter;
          this.meLike = !!res.find((item: Rate) => item.isPositive && item.userId === this.authService.myUser._id);
          this.meDislike = !!res.find((item: Rate) => !item.isPositive && item.userId === this.authService.myUser._id);
      }, err => {
        console.log('err');
        if (err.status === 404) {
          this.likeCounter = 0;
          this.dislikeCounter = 0;
        }
      });
  }

}
