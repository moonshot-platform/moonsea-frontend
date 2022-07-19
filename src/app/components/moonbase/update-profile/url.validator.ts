import { AbstractControl } from '@angular/forms';

export function ValidateUrl(control: AbstractControl) {
  if (!control.value?.startsWith('https') && control.value?.length > 0) {
    return { invalidUrl: true };
  }
  return null;
}