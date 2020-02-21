import { Injectable, NgZone } from '@angular/core'
import { fromEvent, Observable } from 'rxjs'
import { share, startWith, map, shareReplay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicOverlayService {
  windowResize$: Observable<any>
  displayInHost$: Observable<(bp: number) => boolean>

  constructor(zone: NgZone) {
    this.windowResize$ = fromEvent(window, 'resize').pipe(startWith(null), shareReplay(1))
    this.displayInHost$ = this.windowResize$.pipe(
      map(() => (breakpoint: number) => (window.innerWidth < breakpoint ? false : true)),
      shareReplay(1)
    )
  }
}
