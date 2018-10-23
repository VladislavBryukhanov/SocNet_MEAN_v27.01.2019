import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {fromEvent} from 'rxjs/index';
import {exhaustMap, filter, map, pairwise} from 'rxjs/internal/operators';

@Directive({
  selector: '[appInfiniteScroll]'
})
export class InfiniteScrollDirective implements AfterViewInit {

  @Input()
  private scrollCallback;
  @Input()
  private minItemSize: number;
  private scrollEvent$;

  constructor(private elemRef: ElementRef) {}

  ngAfterViewInit(): void {
    console.log(this.elemRef);
    this.scrollEvent$ = fromEvent(this.elemRef.nativeElement, 'scroll');
    console.log(this.scrollEvent$);

    if (!this.isScreenFilled(this.elemRef.nativeElement)) {
      const countOfItems = Math.floor(this.elemRef.nativeElement.clientHeight / this.minItemSize * 1.5);
      this.scrollCallback(countOfItems)
        .subscribe();
    }

    this.scrollEvent$
      .pipe(
        map((e: any) => ({
            clientHeight: e.target.clientHeight,
            scrollHeight: e.target.scrollHeight,
            scrollTop: e.target.scrollTop
          })
        ),
        pairwise(),
        filter(position => this.isScrollingDown(position) && this.isScrollOutOfRange(position[1])),
        exhaustMap(_ => {
          return this.scrollCallback();
        })
      )
      .subscribe();
  }

  isScrollingDown(position): boolean {
    return position[0].scrollTop < position[1].scrollTop;
  }

  isScrollOutOfRange(position): boolean {
    return position.scrollHeight - (position.scrollTop + position.clientHeight) < position.clientHeight;
  }

  isScreenFilled(position): boolean {
    console.log(position.scrollHeight);
    console.log(position.clientHeight);
    return position.scrollHeight > position.clientHeight;
  }

}
