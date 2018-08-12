import { Component } from '@angular/core';
import { IDatepickerRange } from 'MhDatePickerHebrew';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  radioBtnRow = {
    labelRow: 'הצג פניות מ',
    btnList: [
      {
        elementId: 'filter-3-days',
        labelText: '3 ימים אחרונים',
        radioBtnName: 'daysRange',
        count: null,
        value: {
          fromDate: new Date(new Date().setDate(new Date().getDate() - 3)),
          toDate: new Date(),
        }
      }, {
        elementId: 'filter-2-weeks',
        labelText: 'שבועיים אחרונים',
        radioBtnName: 'daysRange',
        count: null,
        value: {
          fromDate: new Date(new Date().setDate(new Date().getDate() - 14)),
          toDate: new Date(),
        }
      }, {
        elementId: 'filter-30-days',
        labelText: '30 יום אחרונים',
        radioBtnName: 'daysRange',
        count: null,
        value: {
          fromDate: new Date(new Date().setDate(new Date().getDate() - 30)),
          toDate: new Date(),
        }
      },
    ]
  };



  public fromToDate: IDatepickerRange = null;

  complexRadio: any;

  public datePickerConfig =  {
    elementId: 'datePicker',
    radioBtnName: 'daysRange',
    iconClass: 'sss',
    ariaLabel: 'sss',
    value: {
      fromDate: null,
      toDate: null,
    }
  };

  onChangeModel(event) {
    console.log('event: ', event);
    console.log('this.fromToDate: ', this.fromToDate);
  }

  onRadioChange(ev) {
    console.log('onRadioChange, ev', ev);
  }
}
