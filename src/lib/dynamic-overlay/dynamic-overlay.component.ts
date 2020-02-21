import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  Output,
  EventEmitter,
  ViewContainerRef,
  HostListener,
} from '@angular/core'
import { OverlayRef, Overlay } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'

@Component({
  selector: 'tgm-dynamic-overlay',
  templateUrl: './dynamic-overlay.component.html',
  styleUrls: ['./dynamic-overlay.component.scss'],
})
export class DynamicOverlayComponent {
  @ViewChild('origin', { static: true }) overlayOrigin: ElementRef<HTMLButtonElement>
  @ViewChild('overlayContentTemplate', { static: false }) overlayContent: TemplateRef<any>

  /**
   * Emits when the overlay is opened
   */
  @Output() opened = new EventEmitter<void>(null)

  /**
   * Emits when the overlay is closed
   */
  @Output() closed = new EventEmitter<void>(null)

  private overlayRef: OverlayRef
  private portal: TemplatePortal<any>

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  @HostListener('click')
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
      backdropClass: 'cdk-transparent-backdrop',
      positionStrategy,
    })

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.detach()
      this.closed.emit()
    })
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
}
