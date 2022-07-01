import { AbstractControl } from '@angular/forms';

export function noOfCopies(control: AbstractControl) {

    var numbers = /^[0-9]+$/;
    if (control.value.toString().match(numbers)) {
        return null;
    } else {
        return { invalidNoOfCopies: true };
    }

}