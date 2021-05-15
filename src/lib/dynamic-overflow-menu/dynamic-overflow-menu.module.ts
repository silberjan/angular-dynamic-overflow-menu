import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DynamicOverflowMenuComponent } from './dynamic-overflow-menu.component'
import { OverlayModule } from '@angular/cdk/overlay'
import { ResponsiveItemDirective } from './responseive-item.directive'
import { PortalModule } from '@angular/cdk/portal'

@NgModule({
  declarations: [DynamicOverflowMenuComponent, ResponsiveItemDirective],
  exports: [DynamicOverflowMenuComponent, ResponsiveItemDirective],
  imports: [CommonModule, OverlayModule, PortalModule],
})
export class DynamicOverflowMenuModule {}
