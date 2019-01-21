import {AfterViewInit, Directive, DoCheck, ElementRef, Input} from '@angular/core';
import {fromEvent} from 'rxjs/index';
import {exhaustMap, filter, map, pairwise} from 'rxjs/internal/operators';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit, DoCheck {

  @Input()
  private scrollCallback;
  @Input()
  private minItemSize: number;
  @Input()
  private initDataSize: number;

  private scrollEvent$;

  private prevScrollHeight;

  private countOfItems = 0;
  private limit = 0;
  private offset = 0;
  private currentPage = 0;

  constructor(private elemRef: ElementRef) {}

  ngDoCheck(): void {
    if (this.prevScrollHeight > this.elemRef.nativeElement.scrollHeight) {
      this.elemRef.nativeElement.dispatchEvent(new Event('scroll'));
    }
    this.prevScrollHeight = this.elemRef.nativeElement.scrollHeight;
  }

  ngAfterViewInit(): void {
    this.scrollEvent$ = fromEvent(this.elemRef.nativeElement, 'scroll');

    this.limit = Math.floor(this.elemRef.nativeElement.clientHeight /
      this.minItemSize * this.initDataSize) + 1;
    this.scrollCallback(this.limit, this.currentPage)
      .subscribe(res => {
        this.countOfItems = res['count'];
        this.offset = res['offset'];
        this.currentPage++;
      });

    this.scrollEvent$
      .pipe(
        map((e: any) => ({
            clientHeight: e.target.clientHeight,
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop
          })
        ),
        filter(position =>
          this.inRangeOfDataCount()
          && this.isScrollOutOfRange(position)),
        exhaustMap(_ => {
          return this.scrollCallback(this.limit, this.currentPage)
        })
      ).subscribe(res => {
        this.countOfItems = res['count'];
        this.offset = res['offset'];
        this.currentPage++;
    });
  }

  isScrollOutOfRange(position): boolean {
    return position.scrollHeight - (position.scrollTop + position.clientHeight)
      < position.clientHeight / 2;
  }

  inRangeOfDataCount() {
    return this.countOfItems > this.offset + this.limit;
  }
}
