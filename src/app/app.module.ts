import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports:      [ BrowserModule, FormsModule, NgxSliderModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    []
})
export class AppModule { }
