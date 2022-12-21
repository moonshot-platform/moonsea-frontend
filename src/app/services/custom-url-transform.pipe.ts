import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';

@Pipe({
  name: 'customUrlTransform'
})
export class CustomUrlTransformPipe implements PipeTransform {

  transform(value: any): any{

    if(ethers.utils.isAddress(value)){
      return  value?.slice(0,4)+'...'+value?.slice(-5);
    }
    return value;
  }

}
