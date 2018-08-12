import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { NgbModule } from '../../node_modules/@ng-bootstrap/ng-bootstrap';

import { MhDatePickerHebrewModule } from 'MhDatePickerHebrew';
import { FilteredRadiobuttonComponent } from './filtered-radiobutton/filtered-radiobutton.component';

@NgModule({
  declarations: [
    AppComponent,
    FilteredRadiobuttonComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    MhDatePickerHebrewModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
