import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicOverlayComponent } from './dynamic-overlay.component'
import { OverlayModule } from '@angular/cdk/overlay'

@NgModule({
  declarations: [DynamicOverlayComponent],
  exports: [DynamicOverlayComponent],
  imports: [CommonModule, OverlayModule],
})
export class DynamicOverlayModule {}
