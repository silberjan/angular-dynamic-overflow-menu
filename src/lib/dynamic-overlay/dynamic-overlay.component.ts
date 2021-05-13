import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs'
import { distinctUntilChanged, map, scan, shareReplay, takeUntil } from 'rxjs/operators'
import { DynamicOverlayService } from './dynamic-overlay.service'

@Component({
  selector: 'jcs-dynamic-overlay',
  templateUrl: './dynamic-overlay.component.html',
  styleUrls: ['./dynamic-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicOverlayComponent implements OnDestroy, AfterViewInit {
  /**
   * Origin for the overlay. (the ●●● button)
   */
  @ViewChild('origin', { static: false }) overlayOrigin: ElementRef<HTMLButtonElement>

  /**
   * The template of items to move back and forth
   */
  @ContentChild(TemplateRef) dynamicContent: TemplateRef<any>

  /**
   * Emits when the overlay is opened
   */
  @Output() opened = new EventEmitter<void>(null)

  /**
   * Emits when the overlay is closed
   */
  @Output() closed = new EventEmitter<void>(null)

  private overlayRef: OverlayRef
  private overlayPortal: TemplatePortal<any>

  hostPortal: TemplatePortal<any>

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
    this.showMoreButton$ = combineLatest([dynamicOverlayService.windowWidth$, this.highgestBreakpoint$]).pipe(
      map(([windowWidth, bp]) => windowWidth < bp),
      distinctUntilChanged(),
      shareReplay(1)
    )

    this.showMoreButton$.pipe(takeUntil(this.destroy$)).subscribe(() => this.close())
  }

  ngAfterViewInit() {
    this.hostPortal = new TemplatePortal(this.dynamicContent, this.viewContainerRef)
  }

  registerBreakpoint(bp: number): void {
    this.breakpoints$.next(bp)
    this.cdr.markForCheck()
    this.cdr.detectChanges()
  }

  open(): void {
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
      panelClass: 'jcs-overlay-panel',
      backdropClass: 'cdk-transparent-backdrop',
      positionStrategy,
    })

    this.overlayRef.backdropClick().subscribe(() => this.close())
    this.overlayPortal = new TemplatePortal(this.dynamicContent, this.viewContainerRef)
    this.overlayRef.attach(this.overlayPortal)
    this.opened.emit()
  }

  close(): void {
    if (!this.overlayRef || !this.overlayRef.hasAttached()) {
      return
    }
    this.overlayRef.detach()
    this.closed.emit()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
