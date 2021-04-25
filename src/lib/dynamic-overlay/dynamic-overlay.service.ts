import { Injectable } from '@angular/core'
import { fromEvent, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicOverlayService {
  windowWidth$: Observable<number>
  displayInHost$: Observable<(bp: number) => boolean>
  constructor() {
    this.windowWidth$ = fromEvent(window, 'resize').pipe(
      shareReplay(1),
      map(() => window.innerWidth)
    )
    this.displayInHost$ = this.windowWidth$.pipe(
      map((windowWidth) => (breakpoint: number) => windowWidth >= breakpoint),
      shareReplay(1)
    )

    // Trigger an initial window resize event. This is kind of hacky but anngular core team does it so its allowed --> https://github.com/angular/components/blob/71955d2e194bfc5561f25daea16e68af266d6ff9/src/material/select/select.ts#L868
    Promise.resolve().then(() => window.dispatchEvent(new Event('resize')))
  }
}
