import { Directive, ElementRef, Host, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
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
    private viewContainer: ViewContainerRef,
    private dynamicOverlayService: DynamicOverlayService,
    @Host() private dynamicOverlayComponent: DynamicOverlayComponent
  ) {}

  ngOnInit(): void {
    const nE: HTMLElement = this.element.nativeElement
    const inHost = nE.parentElement.nodeName === 'JCS-DYNAMIC-OVERLAY'

    this.renderedInHost$ = this.dynamicOverlayService.displayInHost$.pipe(
      map((shouldBeInHost) => (this.itemType === 'auto' ? shouldBeInHost(this.breakpoint) : this.itemType === 'host')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )

    this.dynamicOverlayComponent.registerBreakpoint(this.breakpoint)

    this.renderedInHost$.subscribe((shouldBeInHost) => {
      if (inHost === shouldBeInHost) {
        this.viewContainer.createEmbeddedView(this.localTemplate)
      } else {
        this.viewContainer.clear()
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
