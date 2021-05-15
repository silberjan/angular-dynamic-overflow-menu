import { Directive, ElementRef, Host, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'
import { DynamicOverflowMenuComponent } from './dynamic-overflow-menu.component'
import { DynamicOverflowMenuService } from './dynamic-overflow-menu.service'

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
    private dynamicOverflowMenuService: DynamicOverflowMenuService,
    @Host() private dynamicOverflowMenuComponent: DynamicOverflowMenuComponent
  ) {}

  ngOnInit(): void {
    const nE: HTMLElement = this.element.nativeElement

    function isInHost(element: HTMLElement) {
      return element.parentElement
        ? element.parentElement.nodeName === 'JCS-DYNAMIC-OVERFLOW-MENU'
          ? true
          : isInHost(element.parentElement)
        : false
    }

    const inHost = isInHost(nE)

    this.renderedInHost$ = this.dynamicOverflowMenuService.displayInHost$.pipe(
      map((shouldBeInHost) => (this.itemType === 'auto' ? shouldBeInHost(this.breakpoint) : this.itemType === 'host')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    )

    this.dynamicOverflowMenuComponent.registerBreakpoint(this.breakpoint)

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
