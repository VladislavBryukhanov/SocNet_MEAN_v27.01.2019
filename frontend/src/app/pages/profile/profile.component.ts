import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/user';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {BlogService} from '../../services/blog.service';
import {map} from 'rxjs/internal/operators';
import {ImageViewerService} from '../../services/image-viewer.service';
import {Image} from '../../models/image';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public profile: User;
  public isMyPage = false;

  public scrollCallback;

  constructor(private userService: UsersService,
              private router: ActivatedRoute,
              public imageViewerService: ImageViewerService,
              public blogService: BlogService,
              public authService: AuthService,
              private _router: Router) {

    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this._router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    const profileId = this.router.snapshot.params['id'];
    this.isMyPage = profileId === this.authService.myUser._id;

    this.router.url.subscribe(_ => {
      this.userService.getUserById(profileId)
        .subscribe(res => {
          this.profile = res;
        });
    });
    this.scrollCallback = this.nextPage.bind(this);
  }

  ngOnDestroy() {
    this.blogService.destroy();
  }

  nextPage(maxCount: number, currentPage: number) {
    return this.blogService.getBlog(this.router.snapshot.params['id'], maxCount, currentPage)
      .pipe(
        map(res => {
          this.blogService.blog = this.blogService.blog.concat(res['data']);
          return res;
        })
      );
  }

  openImageViewer(images: Image[], index: number) {
    this.imageViewerService.openImageViewer(images, index);
  }
}
