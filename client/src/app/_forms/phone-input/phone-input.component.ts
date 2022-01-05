import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.css']
})
export class PhoneInputComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() type = 'email';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  /* The functions below are left empty because while their 
  presence is required by the "ControlValueAccessor", they do
  NOT require any logic */
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
