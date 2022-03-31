import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetDataService } from '../../../services/get-data.service';


@Component({
  selector: 'app-nft-detail-list-tabs',
  templateUrl: './nft-detail-list-tabs.component.html',
  styleUrls: ['./nft-detail-list-tabs.component.scss']
})
export class NftDetailListTabsComponent implements OnInit {
  @Input() ID: any;
  @Input() items: any;
  @Input() response:any;
  @Input() nftAddress:any;

  Address: any;
  data: any;
  type: any = '1';
  isApiLoading: any = true;
  indexForPlaceBid = -1;
  indexForPurchase = -1;
  constructor(private getDataService: GetDataService, private router:Router) { }

  ngOnInit(): void {
    this.getList(1);
   
    
  }
  goToProfile(data:any) {
  let url ="profile/"+data + "/tab/like"


    this.router.navigate([url]);
  //  rout ['/profile', items.ownerAddress]"
  }

  async getList(type: any) {

    this.type = type;

    
        this.data = this.response;
        // console.log("nft details list tabs ==>",this.data);
        let i = 0;
        this.data.forEach((value: any, index: any) => {
          if (value.typeOfSale == 1 && this.indexForPurchase == -1) {
            this.indexForPurchase = index;
          }
          else if ((value.typeOfSale == 2 || value.typeOfSale == 3) && this.indexForPlaceBid == -1) {
            this.indexForPlaceBid = index;
          }
        });

        this.isApiLoading = false;
     
  }



  async setList(type: any) {

    this.type = type;

  }

}
