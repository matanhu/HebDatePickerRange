import { Component, OnInit, Input, ElementRef, ViewChild, Renderer, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface IFilteredRadiobutton {
  elementId: string;
  labelText: string;
  count: number;
  radioBtnName: string;
  value: any;
}

@Component({
  selector: 'bz-filtered-radiobutton',
  templateUrl: './filtered-radiobutton.component.html',
  styleUrls: ['./filtered-radiobutton.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilteredRadiobuttonComponent),
      multi: true
    }
  ]
})
export class FilteredRadiobuttonComponent implements OnInit, ControlValueAccessor {

  @Input() ngModel: any;
  @Input() name: string;
  @Input() buttonConfig: IFilteredRadiobutton;

  @ViewChild('radioBtn') radioBtn: ElementRef;

  onChange = (value) => {};
  onTouched = () => {};

  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {}
  ngOnInit(): void {

  }

  writeValue(obj: any): void {
    console.log(this.ngModel === this.buttonConfig.value);
    if (this.ngModel) {
      if (this.ngModel === this.buttonConfig.value) {
        this._renderer.setElementProperty(this.radioBtn.nativeElement, 'checked', this.ngModel === this.buttonConfig.value);
      }
    }
  }
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void {

  }



}
