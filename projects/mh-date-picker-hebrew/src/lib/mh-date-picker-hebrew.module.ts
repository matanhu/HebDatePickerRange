import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MHHebDatepickerRangeComponent } from './mh-heb-datepicker-range/mh-heb-datepicker-range.component';

@NgModule({
  imports: [
    NgbModule
  ],
  declarations: [
    MHHebDatepickerRangeComponent
  ],
  exports: [
    MHHebDatepickerRangeComponent
  ]
})
export class MhDatePickerHebrewModule { }
