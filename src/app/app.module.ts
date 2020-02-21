import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { OverlayButtonModule } from '@targomo/ng/buttons/overlay-button'

import { AppComponent } from './app.component'
import { DynamicOverlayModule } from 'src/lib/dynamic-overlay/dynamic-overlay.module'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, OverlayButtonModule, DynamicOverlayModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
