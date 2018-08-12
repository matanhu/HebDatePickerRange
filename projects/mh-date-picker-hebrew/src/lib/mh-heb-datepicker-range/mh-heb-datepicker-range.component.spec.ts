import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MHHebDatepickerRangeComponent } from './mh-heb-datepicker-range.component';

describe('MHHebDatepickerRangeComponent', () => {
  let component: MHHebDatepickerRangeComponent;
  let fixture: ComponentFixture<MHHebDatepickerRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MHHebDatepickerRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MHHebDatepickerRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
