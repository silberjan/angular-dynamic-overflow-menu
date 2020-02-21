import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core'
import { fromEvent } from 'rxjs'
import { map, share, startWith } from 'rxjs/operators'

@Component({
  selector: 'tgm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  hostContext = { $implicit: 'host' }
  overlayContext = { $implicit: 'overlay' }

  windowResize$ = fromEvent(window, 'resize').pipe(startWith(null), share())

  @ViewChild('itemBox') itemBox: ElementRef<HTMLElement>

  hostOrOverlay$ = this.windowResize$.pipe(
    map(() => (env: 'host' | 'overlay', breakpoint: number) =>
      window.innerWidth < breakpoint ? (env === 'host' ? false : true) : env === 'host' ? true : false
    )
  )

  doesItOverflow(el: HTMLElement) {
    if (el) {
      console.log(el.clientWidth < el.scrollWidth)
    }
    return true
  }
}
