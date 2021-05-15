import { Injectable } from '@angular/core'
import { fromEvent, merge, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicOverflowMenuService {
  windowWidth$: Observable<number>
  displayInHost$: Observable<(bp: number) => boolean>
  constructor() {
    this.windowWidth$ = merge(fromEvent(window, 'DOMContentLoaded'), fromEvent(window, 'resize')).pipe(
      map(() => window.innerWidth),
      shareReplay(1)
    )
    this.displayInHost$ = this.windowWidth$.pipe(
      map((windowWidth) => (breakpoint: number) => windowWidth >= breakpoint),
      shareReplay(1)
    )
  }
}
