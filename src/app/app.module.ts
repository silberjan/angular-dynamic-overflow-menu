import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { DynamicOverflowMenuModule } from 'src/lib/dynamic-overflow-menu/dynamic-overflow-menu.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DynamicOverflowMenuModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
