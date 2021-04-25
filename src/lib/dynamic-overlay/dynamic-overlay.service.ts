import { Injectable } from '@angular/core'
import { fromEvent, Observable } from 'rxjs'
import { map, shareReplay, startWith } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicOverlayService {
  windowResize$: Observable<Event>
  displayInHost$: Observable<(bp: number) => boolean>

  constructor() {
    this.windowResize$ = fromEvent(window, 'resize').pipe(startWith<Event>(null), shareReplay(1))
    this.displayInHost$ = this.windowResize$.pipe(
      map(() => (breakpoint: number) => (window.innerWidth < breakpoint ? false : true)),
      shareReplay(1)
    )
  }
}
