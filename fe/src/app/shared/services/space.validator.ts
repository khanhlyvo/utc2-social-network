import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ValidatorSpace(control: AbstractControl): ValidationErrors {
  if (control.value && control.value.trim().length === 0) {
    return { ValidatorSpace: true };
  }
  return null;
}

export function ValidatorImageURL(control: AbstractControl): ValidationErrors {
  if (control.value && control.value.trim().length > 0 && control.value.trim().match(/(http(s?):)([\S])*\.(?:jpg|png)/) === null) {
    return { ValidatorImageURL: true };
  }
  return null;
}
