import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-search-key',
  templateUrl: './search-key.component.html',
  styleUrls: ['./search-key.component.scss']
})
export class SearchKeyComponent implements OnInit {

  isApiLoading: boolean = true;
  discoverNFTList: any = [];
  dicoverCollectionList :any = [];
  connectedAddress: any;
  searchKey:any ;
  minPrice: any =0;
  maxPrice: any=50000;
  priceSort: string ='';
  flag: boolean = false;

  sortingType:any = 1;
  priceRangeMin:any = 0;
  priceRangeMax :any = 100;
  orderBy :any = "DESC";
  size :any = 12;
  sortByPrice :any =1;
  categotyList :any = [];

  constructor(
    private homeService: HomeService,
    private cs: ContractService,
    private activatedRoute: ActivatedRoute,
    private dataService: CollectionApiService,
    private router: Router,
    private createNFT:CreateNftService
  ) {}

  ngOnInit(): void {
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      // this.HomePageList(1, 'DESC', 1, 12, 1,22);
    });

    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.searchKey = res.searchKey;
    
      
      if( !res.searchKey){
        this.getSearchResult();
      }
      this.getSearchResult();
      this.getCollection();
    });

    window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

    this.getCategotyList();

  }

  async HomePageList(
    type: any,
    orderBy: any,
    priceRange: any,
    size: any,
    id: any,
    lastPrice: any
  ) {
    this.homeService
      .getDiscoverNFTList(
        this.connectedAddress,
        type,
        orderBy,
        priceRange,
        size,
        id,
        lastPrice
      )
      .subscribe((response: any) => {
        this.discoverNFTList = response.data;
      });
    this.isApiLoading = false;
  }

  getSearchResult() {
    let url =
      'home/getNftSearchResult?walletAddress=' +
      this.connectedAddress +
      '&sortingType=' +
      this.sortingType +
      '&priceRangeMin=' +
      this.priceRangeMin +
      '&priceRangeMax=' +
      this.priceRangeMax +
      '&orderBy=' +
      this.orderBy +
      '&size=' +
      this.size +
      '&searchText=' +
      this.searchKey +
      '&sortByPrice=' +
      this.sortByPrice;
    this.dataService.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.discoverNFTList = res.data;
          this.isApiLoading = false;
        } else {
        }
      },
      (err) => {
      }
    );
  }

  getCollection(){
    let url = "home/getCollectionSearchResult?searchText="+ this.searchKey;
    this.dataService.getRequest(url).subscribe(
      (res :any)=>{
        if(res.status == 200){
          this.dicoverCollectionList = res.data;
          
        }else{
        }
      },(err)=>{
      }
    )
  }


  searchMin(minprice){
    this.minPrice = minprice;
    this.getSearchResult();
  }
  searchMax(maxPrice){
    this.maxPrice = maxPrice;
    this.getSearchResult();
  }

  sort(priceSort){
    this.priceSort = priceSort;
    this.getSearchResult();
  }

  clearSearch(){
    this.router.navigate(['/searchcollection'],{queryParams:{searchKey:""}});  
  }

  myFunction() {
    document.getElementById('myDropdown').classList.toggle('show');
  }

  myFunction1() {
    document.getElementById('myDropdown1').classList.toggle('show');
  }

  myFunction2() {
    document.getElementById('myDropdown2').classList.toggle('show');
  }  

  searchClient(searchText: any) {

    this.flag = true;
    this.router.navigate(['/searchcollection'],{queryParams:{searchKey:searchText}});  
  }


  getCategotyList()
  {
      this.createNFT.getCategotyList().subscribe((response:any)=>
        {
          if(response.isSuccess)
          {
            this.categotyList = response.data;
          }
        }
      );
     
  }


}
