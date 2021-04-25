import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { DynamicOverlayModule } from 'src/lib/dynamic-overlay/dynamic-overlay.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DynamicOverlayModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
