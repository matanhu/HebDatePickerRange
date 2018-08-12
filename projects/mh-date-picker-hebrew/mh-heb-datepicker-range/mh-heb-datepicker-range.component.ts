import { Component, OnInit, Injectable, Input, ChangeDetectorRef, forwardRef, ViewChild, HostListener, ElementRef,
  ViewContainerRef, AfterViewInit } from '@angular/core';
import { NgbDateStruct, NgbDatepickerI18n,
  NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { differenceInDays } from 'date-fns';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNumber } from 'util';
import { toInteger, padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';


const I18N_VALUES = {
  'he': {
    weekdays: ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'ראשון'],
    weekdaysShort: ['ב', 'ג', 'ד', 'ה', 'ו', 'ש', 'א'],
    months: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
  }
  // other languages you would support
};

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one && two && two.year === one.year && two.month === one.month && two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day < two.day : one.month < two.month : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
    ? false : one.day > two.day : one.month > two.month : one.year > two.year;

const isMoreThenThirtyDays = (one: Date, two: Date) =>  {
  // console.log('one:', one);
  // console.log('two:', two);
  // console.log('differenceInDays(one, two) > 30:', differenceInDays(one, two) > 30);
  return differenceInDays(one, two) > 30;
};



// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'he';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdaysShort[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return {day: toInteger(dateParts[0]), month: null, year: null};
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ?
        `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? padNumber(date.month) : ''}-${date.year}` :
        '';
  }
}

export const DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MHHebDatepickerRangeComponent),
  multi: true
};

export interface IDatepickerRange {
  fromDate: Date;
  toDate: Date;
}

@Component({
  selector: 'mh-heb-datepicker-range',
  templateUrl: './mh-heb-datepicker-range.component.html',
  styleUrls: ['./mh-heb-datepicker-range.component.scss'],
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR] // define custom NgbDatepickerI18n provider
})
export class MHHebDatepickerRangeComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  public isShow = false;

  @Input() buttonConfig = {
    elementId: 'sss',
    radioBtnName: 'sss',
    value: {
      fromDate: null,
      toDate: null,
    }
  };

  // @ViewChild('dpFrom') dpFrom: NgbDatepicker;
  @ViewChild('dp', { read: ViewContainerRef }) dp: any;
  @Input() placeholder: string;
  @Input() inputName: string;
  @Input() inputId: string;

  dateStruct: NgbDateStruct;

  // fromTodate: IDatepickerRange;
  textFromDate = '';
  textToDate = '';

  public disa = true;
  public mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];


  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;


  private onChangeCallback: (fromToDate: IDatepickerRange) => void = () => {};

  constructor(private cdr: ChangeDetectorRef, private calendar: NgbCalendar, private elementRef: ElementRef) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dp.element.nativeElement.querySelector('[aria-label="Previous month"]').classList.add('prev-month');
    this.dp.element.nativeElement.querySelector('[aria-label="Next month"]').classList.add('next-month');
    this.dp.element.nativeElement.querySelector('.next-month').setAttribute('aria-label', 'חודש הבא');
    this.dp.element.nativeElement.querySelector('.next-month').setAttribute('title', 'חודש הבא');
    this.dp.element.nativeElement.querySelector('.prev-month').setAttribute('aria-label', 'חודש קודם');
    this.dp.element.nativeElement.querySelector('.prev-month').setAttribute('title', 'חודש קודם');
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      console.log(this.dp);
      // this.dp.close();
      this.isShow = false;
    }
  }

  @HostListener('document:keydown', ['$event']) handleKeyDown(event) {
    if (event.srcElement === this.dp.element.nativeElement.querySelector('.prev-month')) {
      if (event.which === 9) {
        if (event.shiftKey) {
          event.preventDefault();
          this.elementRef.nativeElement.querySelector('.cancel').focus();
        }
      }
    }
  }

  onKeyDown(event) {
    console.log(event);
  }

  writeValue(fromTodate: IDatepickerRange): void {
    if (fromTodate) {
      this.buttonConfig.value.fromDate = fromTodate.fromDate;
      this.buttonConfig.value.toDate = fromTodate.toDate;
      if (this.fromDate) {
        this.fromDate = {
          day: fromTodate.fromDate.getDate(),
          month: fromTodate.fromDate.getMonth() + 1,
          year: fromTodate.fromDate.getFullYear()
        };
      }
      if (this.toDate) {
        this.toDate = {
          day: fromTodate.toDate.getDate(),
          month: fromTodate.toDate.getMonth() + 1,
          year: fromTodate.toDate.getFullYear()
        };
      }
      this.cdr.detectChanges();
    } else {
      this.buttonConfig.value = {
        fromDate: new Date(),
        toDate: new Date()
      };
    }
    this.textFromDate = this.getDateString(this.buttonConfig.value.fromDate);

    this.textToDate = this.getDateString(this.buttonConfig.value.toDate);
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {}


  // updateDate(): void {
  //   const newDate: Date = setYear(
  //     setMonth(
  //       setDate(this.date, this.dateStruct.day),
  //       this.dateStruct.month - 1
  //     ),
  //     this.dateStruct.year
  //   );
  //   this.writeValue(newDate);
  //   this.onChangeCallback(this.dateStruct);
  // }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }


  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.buttonConfig.value.fromDate = new Date(date.year, date.month - 1, date.day);
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.buttonConfig.value.toDate = new Date(date.year, date.month - 1, date.day);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.buttonConfig.value.fromDate = new Date(date.year, date.month - 1, date.day);
      this.buttonConfig.value.toDate = null;
    }
    this.writeValue(this.buttonConfig.value);
    this.onChangeCallback(this.buttonConfig.value);
  }

  getDateString(date: Date): any {
    if (date) {
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-
      ${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-
      ${(date.getFullYear()) < 10 ? '0' + date.getFullYear() : date.getFullYear()}`;
    }
  }

  onFromBlur() {
    const tmp = this.textFromDate.split('-');
    this.buttonConfig.value.fromDate = new Date(Number(tmp[2]), Number(tmp[1]) - 1, Number(tmp[0]));
    this.fromDate = {
      day: Number(tmp[0]),
      month: Number(tmp[1]),
      year: Number(tmp[2])
    };
    this.writeValue(this.buttonConfig.value);
    this.onChangeCallback(this.buttonConfig.value);
  }
  onToBlur() {
    const tmp = this.textToDate.split('-');
    this.buttonConfig.value.toDate = new Date(Number(tmp[2]), Number(tmp[1]) - 1, Number(tmp[0]));
    this.toDate = {
      day: Number(tmp[0]),
      month: Number(tmp[1]),
      year: Number(tmp[2])
    };
    this.writeValue(this.buttonConfig.value);
    this.onChangeCallback(this.buttonConfig.value);
  }

  onCancelKeydown(event) {
    if (!event.shiftKey) {
      if (event.which === 9) {
        event.preventDefault();
        this.dp.element.nativeElement.querySelector('.prev-month').focus();
      }
    }
  }

  // onFromClick() {
  //   this.dpTo.close();
  //   if (this.dpFrom.isOpen()) {
  //     this.dpFrom.close();
  //   } else {
  //     this.dpFrom.open();
  //   }
  // }
  // onToClick() {
  //   this.dpFrom.close();
  //   if (this.dpTo.isOpen()) {
  //     this.dpTo.close();
  //   } else {
  //     this.dpTo.open();
  //   }
  // }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && after(date, this.fromDate) && before(date, this.hoveredDate);
  isInside = date => after(date, this.fromDate) && before(date, this.toDate);
  isFrom = date => equals(date, this.fromDate);
  isTo = date => equals(date, this.toDate);

  // tslint:disable-next-line:max-line-length
  isDisabled = date => this.fromDate && isMoreThenThirtyDays(new Date(date.year, date.month - 1, date.day), new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day));
}
