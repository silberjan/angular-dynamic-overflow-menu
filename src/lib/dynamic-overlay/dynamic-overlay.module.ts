import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicOverlayComponent, OverlayBreakpointDirective } from './dynamic-overlay.component'
import { OverlayModule } from '@angular/cdk/overlay'

@NgModule({
  declarations: [DynamicOverlayComponent, OverlayBreakpointDirective],
  exports: [DynamicOverlayComponent, OverlayBreakpointDirective],
  imports: [CommonModule, OverlayModule],
})
export class DynamicOverlayModule {}
