import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicOverlayComponent } from './dynamic-overlay.component'
import { OverlayModule } from '@angular/cdk/overlay'
import { ResponsiveItemDirective } from './responseive-item.directive'
import { PortalModule } from '@angular/cdk/portal'

@NgModule({
  declarations: [DynamicOverlayComponent, ResponsiveItemDirective],
  exports: [DynamicOverlayComponent, ResponsiveItemDirective],
  imports: [CommonModule, OverlayModule, PortalModule],
})
export class DynamicOverlayModule {}
