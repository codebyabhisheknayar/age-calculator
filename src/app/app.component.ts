import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'age-calculator';
  isChecked: boolean = false;
  ageForm: FormGroup;
  age: { years?: number; months?: number | undefined; days?: number | undefined } = {};

  constructor(private fb: FormBuilder) {
    this.ageForm = this.fb.group({
      year: [null, [Validators.required, Validators.min(1900)]],
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      day: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
      syear: [null, [Validators.min(1900)]],
      smonth: [null, [Validators.min(1), Validators.max(12)]],
      sday: [null, [Validators.min(1), Validators.max(31)]],
    });

    this.ageForm.get('month')?.valueChanges.subscribe((monthValue) => {
      const maxDays = this.getMaxDaysInMonth(monthValue);
      this.ageForm.get('day')?.setValidators([Validators.required, Validators.min(1), Validators.max(maxDays)]);
      this.ageForm.get('day')?.updateValueAndValidity();
    });

    this.ageForm.get('smonth')?.valueChanges.subscribe((monthValue) => {
      const maxDays = this.getMaxDaysInMonth(monthValue);
      this.ageForm.get('sday')?.setValidators([Validators.required, Validators.min(1), Validators.max(maxDays)]);
      this.ageForm.get('sday')?.updateValueAndValidity();
    });


    this.ageForm.get('year')?.valueChanges.subscribe((yearValue) => {
      this.ageForm.get('syear')?.setValidators([Validators.min(yearValue)]);
      this.ageForm.get('syear')?.updateValueAndValidity();
    });

  }
  ngOnInit() {

  }
  getMaxDaysInMonth(month: number): number {
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      return 30;
    } else if (month === 2) {
      const year = this.ageForm.get('year')?.value || 0;
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
    } else {
      return 31;
    }
  }
  onCheckboxChange() {
    const syearControl = this.ageForm.get('syear');
    const smonthControl = this.ageForm.get('smonth');
    const sdayControl = this.ageForm.get('sday');

    if (this.isChecked) {
      const yearValue = this.ageForm.get('year')?.value;
      syearControl?.setValidators([Validators.required, Validators.min(yearValue)]);
      smonthControl?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      sdayControl?.setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
    } else {
      syearControl?.clearValidators();
      smonthControl?.clearValidators();
      sdayControl?.clearValidators();
    }
    syearControl?.updateValueAndValidity();
    smonthControl?.updateValueAndValidity();
    sdayControl?.updateValueAndValidity();

  }

  calculateAge(): void {

    let ageInMilliseconds: number;

    if (this.ageForm.invalid) {
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(
      this.ageForm.value.year,
      this.ageForm.value.month - 1,
      this.ageForm.value.day
    );
    const chooseDate = new Date(
      this.ageForm.value.syear,
      this.ageForm.value.smonth - 1,
      this.ageForm.value.sday
    );


    if (selectedDate > currentDate) {
      alert('The selected date is in the future.');
      return;
    }

    if (this.isChecked === true) {
      ageInMilliseconds = chooseDate.getTime() - selectedDate.getTime();
    } else {
      ageInMilliseconds = currentDate.getTime() - selectedDate.getTime();
    }
    const ageDate = new Date(ageInMilliseconds);

    this.age = {
      years: Math.abs(ageDate.getUTCFullYear() - 1970),
      months: ageDate.getUTCMonth(),
      days: ageDate.getUTCDate() - 1
    };
  }

  clearForm(): void {
    this.ageForm.reset(); // This will clear all form controls
  }
}


