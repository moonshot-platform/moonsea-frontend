import { Component, Input, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss']
})
export class OwnersComponent implements OnInit {
  @Input() ID:any; 
  @Input() nftAddress:any;
  Address: any;
  data: any;
  type: any;

  constructor(private getDataService : GetDataService) { }

  ngOnInit(): void {
    this.Address =  localStorage.getItem('address');
    // this.getList(2);
  }
 
}
