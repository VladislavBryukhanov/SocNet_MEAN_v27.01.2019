import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {fromEvent, of, throwError} from 'rxjs/index';
import {catchError, exhaustMap, filter, map, pairwise} from 'rxjs/internal/operators';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit {

  @Input()
  private scrollCallback;
  @Input()
  private minItemSize: number;
  @Input()
  private initDataSize: number;

  private scrollEvent$;

  private countOfItems = 0;
  private offset = 0;
  private itemsForStep = 0;

  constructor(private elemRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.scrollEvent$ = fromEvent(this.elemRef.nativeElement, 'scroll');

    this.itemsForStep = Math.floor(this.elemRef.nativeElement.clientHeight /
      this.minItemSize * this.initDataSize) + 1;
    this.scrollCallback(this.itemsForStep)
      .subscribe(res => {
        this.countOfItems = res['count'];
        this.offset = res['offset'];
      });

    this.scrollEvent$
      .pipe(
        map((e: any) => ({
            clientHeight: e.target.clientHeight,
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop
          })
        ),
        pairwise(),
        filter(position =>
          this.inRangeOfDataCount()
          && this.isScrollingDown(position)
          && this.isScrollOutOfRange(position[1])),
        exhaustMap(_ => {
          return this.scrollCallback(this.itemsForStep)
        })
      ).subscribe(res => {
        this.countOfItems = res['count'];
        this.offset = res['offset'];
    });
  }

  isScrollingDown(position): boolean {
    return position[0].scrollTop < position[1].scrollTop;
  }

  isScrollOutOfRange(position): boolean {
    return position.scrollHeight - (position.scrollTop + position.clientHeight)
      < position.clientHeight;
  }

  inRangeOfDataCount() {
    return this.countOfItems > this.offset + this.itemsForStep;
  }

}
