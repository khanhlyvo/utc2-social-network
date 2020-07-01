import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static getValidationErrorMessage(validationName: string, validatorValue?: any, labelName?: string): any {
    const config = {
      required: `${labelName} is required!`,
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      maxLength: `The field can't contain more than ${validatorValue.requiredLength} characters.`,
      minLength: `The field must contain atleast ${validatorValue.requiredLength} characters.`
    };
    return config[validationName];
  }

  static passwordValidator(control: AbstractControl): any {
    if (!control.value) {
      return;
    }
    // {8,30}            - Assert password is between 8 and 30 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?!.*\s)          - Spaces are not allowed
    return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{8,30}$/)) ? '' : { invalidPassword: true };
  }
}
