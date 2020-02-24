import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core'
import { combineLatest, Observable, of, Subject, from, BehaviorSubject } from 'rxjs'
import {
  distinctUntilChanged,
  map,
  mergeScan,
  switchMap,
  takeUntil,
  tap,
  startWith,
  shareReplay,
  share,
  withLatestFrom,
  reduce,
  scan,
} from 'rxjs/operators'
import { DynamicOverlayService } from './dynamic-overlay.service'

@Component({
  selector: 'tgm-dynamic-overlay',
  templateUrl: './dynamic-overlay.component.html',
  styleUrls: ['./dynamic-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicOverlayComponent implements OnDestroy {
  @ViewChild('origin', { static: false }) overlayOrigin: ElementRef<HTMLButtonElement>
  @ContentChild(TemplateRef) overlayContent: TemplateRef<any>
  /**
   * Emits when the overlay is opene
   */
  @Output() opened = new EventEmitter<void>(null)

  /**
   * Emits when the overlay is closed
   */
  @Output() closed = new EventEmitter<void>(null)

  private overlayRef: OverlayRef
  private portal: TemplatePortal<any>

  private breakpoints$ = new BehaviorSubject<number>(0)
  private highgestBreakpoint$ = this.breakpoints$.pipe(
    scan((acc, val) => (val > acc ? val : acc), 0),
    distinctUntilChanged()
  )

  showMoreButton$: Observable<boolean>

  private destroy$ = new Subject<void>()

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    dynamicOverlayService: DynamicOverlayService
  ) {
    this.showMoreButton$ = dynamicOverlayService.windowResize$.pipe(
      withLatestFrom(this.highgestBreakpoint$),
      map(([, bp]) => window.innerWidth < bp),
      distinctUntilChanged(),
      shareReplay(1)
    )

    this.showMoreButton$.pipe(takeUntil(this.destroy$)).subscribe(() => this.close())
  }

  registerBreakpoint(bp: number) {
    this.breakpoints$.next(bp)
    this.cdr.markForCheck()
    this.cdr.detectChanges()
  }

  open() {
    if (!!this.overlayRef && this.overlayRef.hasAttached()) {
      return
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.overlayOrigin)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
      ])

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: 'tgm-overlay-panel',
      backdropClass: 'cdk-transparent-backdrop',
      positionStrategy,
    })

    this.overlayRef.backdropClick().subscribe(() => this.close())
    this.portal = new TemplatePortal(this.overlayContent, this.viewContainerRef)
    this.overlayRef.attach(this.portal)
    this.opened.emit()
  }

  close() {
    if (!this.overlayRef || !this.overlayRef.hasAttached()) {
      return
    }
    this.overlayRef.detach()
    this.closed.emit()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}

@Directive({
  selector: '[tgmResponsiveItem]',
})
export class ResponsiveItemDirective implements OnDestroy, OnInit {
  @Input('tgmResponsiveItem') itemType: 'auto' | 'host' | 'overlay' = 'auto'

  @Input('tgmResponsiveItemBreakpoint') breakpoint = 0

  private destroy$ = new Subject<void>()
  renderedInHost$: Observable<boolean>

  constructor(
    private element: ElementRef,
    private localTemplate: TemplateRef<string>,
    private viewContainer: ViewContainerRef,
    private dynamicOverlayService: DynamicOverlayService,
    @Host() private dynamicOverlayComponent: DynamicOverlayComponent
  ) {}

  ngOnInit() {
    const nE: HTMLElement = this.element.nativeElement
    const inHost = nE.parentElement.nodeName === 'TGM-DYNAMIC-OVERLAY'

    this.renderedInHost$ = this.dynamicOverlayService.displayInHost$.pipe(
      map(shouldBeInHost => (this.itemType === 'auto' ? shouldBeInHost(this.breakpoint) : this.itemType === 'host')),
      distinctUntilChanged(),
      takeUntil(this.destroy$.asObservable())
    )

    this.dynamicOverlayComponent.registerBreakpoint(this.breakpoint)

    this.renderedInHost$.subscribe(shouldBeInHost => {
      if (inHost === shouldBeInHost) {
        this.viewContainer.createEmbeddedView(this.localTemplate)
      } else {
        this.viewContainer.clear()
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
