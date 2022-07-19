import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GetDataService } from '../../../services/get-data.service';
import blockjson from '../../../../assets/blockchainjson/blockchain.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nft-detail-list-tabs',
  templateUrl: './nft-detail-list-tabs.component.html',
  styleUrls: ['./nft-detail-list-tabs.component.scss']
})
export class NftDetailListTabsComponent implements OnInit ,OnChanges{
  @Input() ID: any;
  @Input() items: any={};
  @Input() response:any;
  @Input() nftAddress:any;

  Address: any;
  data: any;
  type: any = '1';
  isApiLoading: any = true;
  indexForPlaceBid = -1;
  indexForPurchase = -1;
  blockchainInfo:any ={};
  constructor(private getDataService: GetDataService, private router:Router) { }
  ngOnChanges(changes: SimpleChanges): void {
   
    
  }

  ngOnInit(): void {
    
    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.items?.blockchainId){
        this.blockchainInfo = element;
      }
    });
    this.getList(1);
    
    
  }


  goToProfile(data:any) {
    
  let url ="/profile/"+data;


    this.router.navigate([url]);
  //  rout ['/profile', items.ownerAddress]"
  }

  async getList(type: any) {

    this.type = type;

    
        this.data = this.response;
        let i = 0;
      if(this.data.length > 0){
        this.data.forEach((value: any, index: any) => {
          if (value.typeOfSale == 1 && this.indexForPurchase == -1) {
            this.indexForPurchase = index;
          }
          else if ((value.typeOfSale == 2 || value.typeOfSale == 3) && this.indexForPlaceBid == -1) {
            this.indexForPlaceBid = index;
          }
        });
      }

        this.isApiLoading = false;
     
  }



  async setList(type: any) {

    this.type = type;

  }

}
