import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformNumber'
})
export class TransformNumberPipe implements PipeTransform {

  transform(value: any, ): any {
    let str = value+' ';
    return str.slice(0,4);
  }

}
