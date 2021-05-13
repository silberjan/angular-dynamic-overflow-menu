import { OverlayContainer } from '@angular/cdk/overlay'
import {
  Directive,
  ElementRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'
import { DynamicOverlayComponent } from './dynamic-overlay.component'
import { DynamicOverlayService } from './dynamic-overlay.service'

@Directive({
  selector: '[jcsResponsiveItem]',
})
export class ResponsiveItemDirective implements OnDestroy, OnInit {
  @Input('jcsResponsiveItem') itemType: 'auto' | 'host' | 'overlay' = 'auto'

  @Input('jcsResponsiveItemBreakpoint') breakpoint = 0

  private destroy$ = new Subject<void>()

  renderedInHost$: Observable<boolean>

  constructor(
    private element: ElementRef,
    private localTemplate: TemplateRef<string>,
    private vcr: ViewContainerRef,
    private dynamicOverlayService: DynamicOverlayService,
    @Host() private dynamicOverlayComponent: DynamicOverlayComponent
  ) {}

  ngOnInit(): void {
    const nE: HTMLElement = this.element.nativeElement

    function isInHost(element: HTMLElement) {
      return element.parentElement
        ? element.parentElement.nodeName === 'JCS-DYNAMIC-OVERLAY'
          ? true
          : isInHost(element.parentElement)
        : false
    }

    const inHost = isInHost(nE)

    this.renderedInHost$ = this.dynamicOverlayService.displayInHost$.pipe(
      map((shouldBeInHost) => (this.itemType === 'auto' ? shouldBeInHost(this.breakpoint) : this.itemType === 'host')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )

    this.dynamicOverlayComponent.registerBreakpoint(this.breakpoint)

    this.renderedInHost$.subscribe((shouldBeInHost) => {
      if (inHost === shouldBeInHost) {
        this.vcr.createEmbeddedView(this.localTemplate)
      } else {
        this.vcr.clear()
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
