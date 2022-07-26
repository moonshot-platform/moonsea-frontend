import { Component, OnInit, Input } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { ActivatedRoute } from '@angular/router';
import { GetDataService } from 'src/app/services/get-data.service';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  toppings = new FormControl('');
  expanded = false;
  expandedMobile = false;
  status: any = "-1";
  searchKeyWord: any = '';
  minPrice: any = 0;
  maxPrice: any = 5000;
  sortingType: any = 2;
  size: any = 12;
  propertiesValue: any = '';
  categoryId: any = 0;
  sortByPrice: any = 0;
  totalCount :any;

  constructor(
    private collectionApi: CollectionApiService,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private getDataService: GetDataService,
    private ngxService: NgxUiLoaderService,
    private toaster:ToastrService
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
      this.getNftList01();
    });

    this.getDataService.getCategoryNames(1).subscribe((list) => {
      this.nftListNames = list.data;
    });
    // this.getproperty();
    this.test()
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
        this.status,
        JSON.stringify(this.filterArray)
      )
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.nftList = response.data;
          this.totalCount = response.totalCount;
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
  filter01(mySelectprice:any){
    this.sortingType = mySelectprice;
    this.getNftList01();
  }
  filter02(status01:any){
    this.status =status01;
    this.getNftList01();
  }

  searchCollection() {
    this.getNftList01();
    
  }

  searchAll() {
    if (this.searchKeyWord.length == 0) {
      this.getNftList01();
    }
  }

  frequency: any = [];
  uniqueNamesData: any = [];
  proeprties: any = [];
  proeprtiesCopy: any = [];
  getproperty() {
    const url = 'api/getProperties?collectionId=' + this.collectionId;
    // const url = 'api/getProperties?collectionId=' + 8;
  let promise = new Promise((resolve,reject)=>{
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
          this.foo = new Array(this.uniqueNamesData.length);
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

            resolve(this.proeprties);
            
          });
        } else {
          // alert(res.message);
          this.toaster.error(res.message)
        }
      },
      (err) => {
      }
    );
   
  })

  return promise;
    
    
  }

  async test(){
  this.proeprtiesCopy =  await this.getproperty();
  //  console.log(this.proeprtiesCopy);
  }

  

   filterArray :any =[];
  
  propertiesSelection(key: any,indexing:any) {
  
    this.foo[indexing] = this.toppings.value;
    debugger
    let value: any = [];
    let keys: any = [];
    
    this.foo.filter(function (el: any) {
      if (el.length > 0) {
        for (let i = 0; i < el.length; i++) {
          value.push(el[i].value);
          keys.push(el[i].key);
        }
      }
    });

    
  
    this.foo.forEach((el:any,index:any)=>{
      let temp = [];
      for(let i=0;i<el.length;i++){
        if(el[i].key == key){
          temp.push(el[i].value)
         if(this.filterArray.length == 0){
          this.filterArray.push({keys:key,value:temp});
         }else{
          for(let j=0;j<this.filterArray.length;j++){
            if(this.filterArray[j].keys == key){
              this.filterArray[j].value = temp ; 
            }
             let result = this.filterArray.find((x: any[])=>x.keys == key);
              if(!result){
                this.filterArray.push({keys:key,value:temp});
              }
            
          }
        
         }
        
        }
       
      }
      let elKeys :any;
      this.foo.filter(function (elem: any) {
          for (let i = 0; i < elem.length; i++) {
            if(elem[i].key == key){
              elKeys = elem[i].key;
            }
          }
      });
        if(this.foo[index].length == 0 && !elKeys){
          var resultIndex=this.filterArray.findIndex(x=>x.keys == key); 
         if(resultIndex >=0){
          this.filterArray.splice(resultIndex,1);
         }
        }
       
    })

      
  
    
    this.oldpropertiesValue = value.join(',');
    this.oldpropertiesKey = keys.join(',');
    this.getNftList01();
   
  }

  toppings02 = new FormControl('');
  selectedPropertiesCoutn = 0;

  propertiesSelection02(key: any,indexing:any){
    this.selectedPropertiesCoutn = 0;
    this.foo[indexing] = this.toppings02.value;
 
    this.foo.forEach((element:any) => {
        if(element.length>0){
          this.selectedPropertiesCoutn = this.selectedPropertiesCoutn + element.length;
        }
    });
    let value: any = [];
    let keys: any = [];
    this.foo.filter(function (el: any) {
      if (el.length > 0) {
        for (let i = 0; i < el.length; i++) {
          value.push(el[i].value);
          keys.push(el[i].key);
        }
      }
    });

    
  
    this.foo.forEach((el:any,index:any)=>{
      let temp = [];
      for(let i=0;i<el.length;i++){
        if(el[i].key == key){
          temp.push(el[i].value)
         if(this.filterArray.length == 0){
          this.filterArray.push({keys:key,value:temp});
         }else{
          for(let j=0;j<this.filterArray.length;j++){
            if(this.filterArray[j].keys == key){
              this.filterArray[j].value = temp ; 
            }
             let result = this.filterArray.find((x: any[])=>x.keys == key);
              if(!result){
                this.filterArray.push({keys:key,value:temp});
              }
            
          }
        
         }
        
        }
       
      }
      let elKeys :any;
      this.foo.filter(function (elem: any) {
          for (let i = 0; i < elem.length; i++) {
            if(elem[i].key == key){
              elKeys = elem[i].key;
            }
          }
      });
        if(this.foo[index].length == 0 && !elKeys){
          var resultIndex=this.filterArray.findIndex(x=>x.keys == key); 
         if(resultIndex >=0){
          this.filterArray.splice(resultIndex,1);
         }
        }
       
    })

      
  
    
    this.oldpropertiesValue = value.join(',');
    this.oldpropertiesKey = keys.join(',');
    this.getNftList01();
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  toggleMobile() {
    this.expandedMobile = !this.expandedMobile;
  }

}
