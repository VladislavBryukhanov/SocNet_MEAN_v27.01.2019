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

  constructor(private elemRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.scrollEvent$ = fromEvent(this.elemRef.nativeElement, 'scroll');

    const countOfItems = Math.floor(this.elemRef.nativeElement.clientHeight /
      this.minItemSize * this.initDataSize) + 1;
    this.scrollCallback(countOfItems)
      .subscribe();

    this.scrollEvent$
      .pipe(
        map((e: any) => ({
            clientHeight: e.target.clientHeight,
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop
          })
        ),
        pairwise(),
        filter(position => this.isScrollingDown(position)
          && this.isScrollOutOfRange(position[1])),
        exhaustMap(_ => {
          return this.scrollCallback(countOfItems)
            .pipe(
              catchError(err => {
                if (err.status === 404) {
                  console.log('full data loaded');
                }
                return throwError(err);
              })
            );
        })
      )
      .subscribe();
  }

  isScrollingDown(position): boolean {
    return position[0].scrollTop < position[1].scrollTop;
  }

  isScrollOutOfRange(position): boolean {
    return position.scrollHeight - (position.scrollTop + position.clientHeight)
      < position.clientHeight;
  }

}
