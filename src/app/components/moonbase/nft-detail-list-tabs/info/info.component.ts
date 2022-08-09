import { Component, Input, OnInit } from '@angular/core';
import { GetDataService } from 'src/app/services/get-data.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  @Input() ID:any;
  Address: any;
  data: any;
  type: any;
  constructor(private getDataService : GetDataService,private cs:ContractService) { }

  ngOnInit(): void {
    this.cs.getWalletObs().subscribe((data:any)=>
    {
      this.Address = data;
    });

    this.getListInfo(1);
  }
  async getListInfo(type:any)
  {
    this.getDataService.getListInfo(
      this.ID
    ).subscribe((response:any)=>
    {
      this.data = response.data;
      this.type = type;
    })
  }
}
