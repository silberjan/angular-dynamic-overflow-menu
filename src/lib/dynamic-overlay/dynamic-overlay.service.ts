import { Injectable } from '@angular/core'
import { fromEvent } from 'rxjs'
import { share, startWith, map, shareReplay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicOverlayService {
  windowResize$ = fromEvent(window, 'resize').pipe(startWith(null), shareReplay(1))
  hostOrOverlay$ = this.windowResize$.pipe(
    map(() => (env: 'host' | 'overlay', breakpoint: number) =>
      window.innerWidth < breakpoint ? (env === 'host' ? false : true) : env === 'host' ? true : false
    ),
    shareReplay(1)
  )
}
