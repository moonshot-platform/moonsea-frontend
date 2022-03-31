import {
  AbstractControl, 
  NG_VALIDATORS, 
  Validator, 
  ValidatorFn
} from '@angular/forms';
import { ethers } from "ethers";
import {Directive} from '@angular/core';

export function checkIsAddress(): ValidatorFn {  
  return (control: AbstractControl): { [key: string]: any } | null =>  
    (control.value.length==0 || ethers.utils.isAddress(control.value))  
            ? null : {wrongColor: control.value};
}

@Directive({  
  selector: '[checkIsAddress]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: CheckIsAddressDirective,
      multi: true
  }]
})
export class CheckIsAddressDirective implements Validator { 
  
  validate(control: AbstractControl): { [key: string]: any } | null { 
      return checkIsAddress()(control);  
  }
}
