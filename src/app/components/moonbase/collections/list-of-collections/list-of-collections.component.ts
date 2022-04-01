import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { CollectionApiService } from 'src/app/services/collection-api.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import SwiperCore, { SwiperOptions, Navigation } from 'swiper';

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-list-of-collections',
  templateUrl: './list-of-collections.component.html',
  styleUrls: ['./list-of-collections.component.scss'],
})
export class ListOfCollectionsComponent implements OnInit {
  config: SwiperOptions = {
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
      1600: {
        slidesPerView: 3,
      },
    },
  };

  pageNo: any = 0;
  PageSize: any = 9;
  isShowLoader: boolean = false;

  collectionlist: any = [];
  searchKey: any = '';
  minPrice: any = 0;
  maxPrice: any = 0;
  categotyList :any = [];
  blockchainList :any = [];
  currencySymbol :any ='';
  blockchainId :any ;
  categoryId:any;
  categoryName:any ='';

  constructor(
    private dataservice: CollectionApiService,
    private ngxService: NgxUiLoaderService,
    private createNFT:CreateNftService,
    private router :Router
  ) {}

  ngOnInit(): void {
    this.blockchainId = 0;
    this.categoryId = 0;

    // console.log(this.router.url,"Current URL");
    


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
    this.getBlockchainList(); 
    this.getListofCollection();
  }

  getListofCollection() {
    this.isShowLoader = true;
    this.ngxService.start();
    let url ="home/getCollectionListAll?pageNo="+this.pageNo+"&PageSize="+this.PageSize+"&searchText="+this.searchKey+"&blockchainId="+this.blockchainId+"&categoryId="+this.categoryId;

    this.dataservice.getRequest(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
         
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
              response.data[i].nftFileUrl01 =
                response.data[i].nftDetailsList[0].nftFileUrl;
              response.data[i].nftTokenID01 =
                response.data[i].nftDetailsList[0].nftTokenID;
              response.data[i].nftAddress =
                response.data[i].nftDetailsList[0].nftAddress;
            }
          }
          // this.collectionlist = response.data;
          // this.collectionlist.push(response.data)
          response.data.forEach(element => {
              this.collectionlist.push(element)
          });
          // console.log("!!!!!!=>",this.collectionlist);
          
          this.ngxService.stop();
          this.isShowLoader = false;
        } else {
          this.ngxService.stop();
        }
      },
      (err: any) => {
        console.log(err);
        this.ngxService.stop();
      }
    );
  }

  getListofCollection01(blockchainId:any,currencySymbol:any){
   this.blockchainId = blockchainId;
   this.currencySymbol = currencySymbol;
   this.collectionlist = [];
    this.getListofCollection();
  }
  getNftlistbyCategory(categoryId:any,categoryName:any){
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.collectionlist = [];
    this.getListofCollection();
  }




  arr = [];
  search() {
    if (this.searchKey.length >= 2) {
      this.pageNo = 0;
      this.arr = [];
      this.arr = this.collectionlist;
      this.collectionlist = [];
      this.getListofCollection();
      // this.collectionlist.filter((el :any)=>{
      //   if(el.symbol.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1 ){
      //     arr.push(el);
      //     console.log(arr);

      //   }
      // });

      // if(arr.length >0){
      //   this.collectionlist = [];
      //   this.collectionlist = arr;
      // }
    }

    if (this.searchKey.length == 0) {
      this.collectionlist = [];
      // this.collectionlist = this.arr;
      this.pageNo = 0;
      this.getListofCollection();
    }
  }

  search01() {
    if (this.searchKey.length == 0) {
      this.collectionlist = [];
      this.pageNo = 0;
      this.getListofCollection();
    }
  }

  

  loadmore() {
    this.pageNo = this.pageNo + 1;
    this.getListofCollection();
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


  searchClient(searchKey:any){
    this.searchKey = searchKey;
    this.collectionlist = [];
    this.getListofCollection()
  }
  clearSearch(){
    this.searchKey = 'searched word';
    document.getElementById("textSearch").innerHTML = "searched word";
  }

  getCategotyList()
  {
      this.createNFT.getCategotyList().subscribe((response:any)=>
        {
          if(response.isSuccess)
          {
            this.categotyList = response.data;
            this.categoryId = this.categotyList[0].categoryId;
            this.categoryName = this.categotyList[0].categoryName;
          }
        }
      );
     
  }

  getBlockchainList() {
    this.createNFT.getBlockchainList().subscribe((response: any) => {
      this.blockchainList = response.data;
      this.currencySymbol = this.blockchainList[0].networkName; 
      this.blockchainId = this.blockchainList[0].blockchainId;
    });
  }

  gotoNftDetails(nftAddress: any, id: any) {

    this.router.navigate(['/details', nftAddress, id]);
  }
}
