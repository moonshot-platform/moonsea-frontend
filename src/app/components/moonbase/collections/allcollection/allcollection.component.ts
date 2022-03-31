import { Component, OnInit, Input } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from 'src/app/services/get-data.service';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-allcollection',
  templateUrl: './allcollection.component.html',
  styleUrls: ['./allcollection.component.scss'],
})
export class AllcollectionComponent implements OnInit {
  @Input() collectionId: any;
  nftList: any;
  nftListNames: any;
  checker: any;
  data: any;
  isApiLoading: boolean = true;
  oldsortingType: any;
  oldpriceRangeMin: any;
  oldpriceRangeMax: any;
  orderBy: any = 'DESC';
  activeVar: any = 'allData';
  walletAddress: any;
  oldpropertiesValue: any = '';
  oldpropertiesKey: any = '';
  oldsearchText: any;
  oldcategoryId: any;
  oldsortByPrice: any;
  count: any;
  propetiesArray: any = [];
  panelOpenState: boolean = false;
  foo: any = [];
  expanded = false;
  status: any = "-1";
  searchKeyWord: any = '';
  minPrice: any = 0;
  maxPrice: any = 5000;
  sortingType: any = 2;
  size: any = 12;
  propertiesValue: any = '';
  categoryId: any = 0;
  sortByPrice: any = 0;

  constructor(
    private collectionApi: CollectionApiService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private getDataService: GetDataService,
    private ngxService: NgxUiLoaderService
  ) {
    // route.params.subscribe(
    //   (params) =>{
    //   this.walletAddress = params['walletAddress'];
    //   });
    this.walletAddress = localStorage.getItem('address');
  }

  ngOnInit(): void {
    this.sortingType = 2;
    this.contractService.getWalletObs().subscribe((data: any) => {
      this.data = data;
      console.log("===========",data);      
      this.getNftList01();
    });

    this.getDataService.getCategoryNames(1).subscribe((list) => {
      this.nftListNames = list.data;
    });
    this.getproperty();
    this.filter();
  }

 
  getNftList01() {
    this.ngxService.start();

    this.isApiLoading = true;
    this.collectionApi
      .getNFTListAll(
        this.collectionId,
        this.walletAddress,
        this.sortingType,
        this.minPrice,
        this.maxPrice,
        this.size,
        this.oldpropertiesKey,
        this.oldpropertiesValue,
        this.searchKeyWord,
        this.categoryId,
        this.status
      )
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.nftList = response.data;
          this.count = response.data.length;
          this.isApiLoading = false;
          this.ngxService.stop();
        }
        else{
          this.ngxService.stop();

        }
      },(err)=>{
        this.ngxService.stop();
      });
  }

 
  loadmore(){
    this.size = this.size * 2;
    this.getNftList01();
  }


  filter() {
    this.getNftList01();
  }

  searchCollection() {
    this.getNftList01();
    // let nftArray =  [];

    // this.nftList.filter((element:any) => {
    //     if(element.title.toLowerCase().indexOf(this.searchKeyWord.toLowerCase())   >  -1 ){
    //       nftArray.push(element);
    //     }
    // });

    // if(nftArray.length > 0){
    //   this.nftList = [];
    //   this.nftList = nftArray;
    // }
  }

  searchAll() {
    if (this.searchKeyWord.length == 0) {
      this.getNftList01();
    }
  }

  frequency: any = [];
  uniqueNamesData: any = [];
  proeprties: any = [];
  getproperty() {
    const url = 'api/getProperties?collectionId=' + this.collectionId;
    this.collectionApi.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.propetiesArray = res.data;

          for (let i = 0; i < this.propetiesArray.length; i++) {
            if (
              this.uniqueNamesData.indexOf(this.propetiesArray[i].keys) === -1
            ) {
              this.uniqueNamesData.push(this.propetiesArray[i].keys);
              //this.foo.push("")
            }
          }

          // console.log("unique key=>",uniqueNames);
          this.uniqueNamesData.forEach((element: any, index: any) => {
            this.proeprties[index] = [];
            let count = 0;
            let arr = this.propetiesArray.filter(function (el: any) {
              if (el.keys == element) {
                count += el.totalCount;
                return true;
              }
              return false;
            });
            this.proeprties[index] = arr;

            this.proeprties[index].count = count;
          });
          // console.log( this.proeprties);
        } else {
          alert(res.message);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  propertiesSelection(i: any) {
    let values: any = [];
    let keys: any = [];

    this.foo.filter(function (el: any) {
      if (el.length > 0) {
        for (let i = 0; i < el.length; i++) {
          values.push(el[i].value);
          keys.push(el[i].key);
        }
      }
    });

    this.oldpropertiesValue = values.join(',');
    this.oldpropertiesKey = keys.join(',');
    this.getNftList01();
   
  }

  toggle() {
    this.expanded = !this.expanded;
  }
}
