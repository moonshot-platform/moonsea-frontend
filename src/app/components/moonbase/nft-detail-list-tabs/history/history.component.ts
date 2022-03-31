import { Component, Input, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input() ID:any;
  @Input() nftAddress:any;
  data: any;
  type: any;
  isApiLoading : any = true;
  totalCount: any;
  
  constructor(private getDataService : GetDataService) { }

  ngOnInit(): void {
    this.getListHistory(2);
  }

  async getListHistory(type:any)
  {
    
    this.getDataService.getListBidHistory(
      this.ID,this.nftAddress
    ).subscribe((response:any)=>
    {
      
      this.data = response.data;
      this.type = type;
      this.isApiLoading = false;
      this.totalCount = this.data.length;

    })
  
  }

}
