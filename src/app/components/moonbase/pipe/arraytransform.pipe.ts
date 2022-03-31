import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraytransform',
})
export class ArraytransformPipe implements PipeTransform {
  temparray: any = [];
  

  transform(value: unknown, ...args: unknown[]): unknown {
    this.temparray = value;
    
    // var data = [
    //   {
    //     _id: '500004',
    //     subject: 'Complete the task',
    //     date: '25 Aug, 2013',
    //   },
    //   {
    //     _id: '500004',
    //     subject: 'Complete the task',
    //     date: '25 Aug, 2013',
    //   },
    //   {
    //     _id: '500005',
    //     subject: 'Attend to the event',
    //     date: '2 Jan, 2013',
    //   },
    //   {
    //     _id: '500065',
    //     subject: 'Some task deadline',
    //     date: '20 Sep, 2013',
    //   },
    //   {
    //     _id: '500004',
    //     subject: 'Complete the task',
    //     date: '25 Aug, 2013',
    //   },
    // ];

    var uniqueNames = [];
    var uniqueObj = [];

    for (let i = 0; i < this.temparray.length; i++) {
      if (uniqueNames.indexOf(this.temparray[i].keys) === -1 || (this.temparray[i].keys) > -1) {
        // uniqueObj.push(this.temparray[i]);
        uniqueObj.push({key:{"value":this.temparray[i].value,
        "totalCount":this.temparray[i].value}});
        uniqueNames.push(this.temparray[i].keys);
      
      }
     
    }

    console.log('uniqueObj', uniqueObj);

    return null;
  }
}
