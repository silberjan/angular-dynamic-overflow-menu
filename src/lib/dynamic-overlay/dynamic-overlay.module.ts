import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicOverlayComponent, ResponsiveItemDirective } from './dynamic-overlay.component'
import { OverlayModule } from '@angular/cdk/overlay'

@NgModule({
  declarations: [DynamicOverlayComponent, ResponsiveItemDirective],
  exports: [DynamicOverlayComponent, ResponsiveItemDirective],
  imports: [CommonModule, OverlayModule],
})
export class DynamicOverlayModule {}
