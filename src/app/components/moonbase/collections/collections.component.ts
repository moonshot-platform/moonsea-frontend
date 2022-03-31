import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  discoverNFTList = [];
  connectedAddress: any;
  oldtype: any;
  oldorderBy: any;
  oldpriceRange: any;
  tabHeadings: any = [];
  tabHeadingsUrl: any = [];
  tab: any
  isApiLoading: boolean = true;
  nftListNames: any;
  id: any
  constructor(private homeService: HomeService, private cs: ContractService, private getDataService: GetDataService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0)

    
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      
      this.HomePageList(1, 'DESC', 1, 12, 1,22);
    });


    this.getDataService.getCategoryNames(1).subscribe((list) => {
      this.tabHeadings = list.data;
      this.tab = this.tabHeadings[0]
      this.tabHeadingsUrl = list.data;
    })

  }

  async HomePageList(type: any, orderBy: any, priceRange: any, size: any, id: any,lastPrice:any) {
  

    if(orderBy == 11)
    {
    type = 11;
    orderBy = 'DESC';
    }
    else if(orderBy == 22)
    {
      type = 11;
      orderBy = 'ASC';  
    }
    
    
    this.homeService.getDiscoverNFTList(this.connectedAddress, type, orderBy, priceRange, size, id,lastPrice).subscribe((response: any) => {
      this.discoverNFTList = response.data;
    })

    // setTimeout(() =>{
        
    //   this.isApiLoading = false;
    // this.discoverNFTList = response.data;

    // },700);
    // this.isApiLoading = true;

    this.isApiLoading = false;
    this.oldtype = type;
    this.oldorderBy = orderBy;
    this.oldpriceRange = priceRange

  }


  formatLabel(value: number) {
    console.warn(value);
    return value;
  }
  selectCategory(data: any, name: any) {
   
    this.tab = name
    this.id = data
    this.HomePageList(1, 'DESC', 1, 12, this.id,22);
  }
}
