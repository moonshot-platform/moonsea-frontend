import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dicimalTransform'
})
export class DicimalTransformPipe implements PipeTransform {

  transform(value: any): any {
    let str = value+'';
    return str?.slice(0,6);
  }

}
