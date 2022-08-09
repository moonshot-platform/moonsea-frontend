import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs/internal/Subscription';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment';
import SwiperCore, { SwiperOptions, Navigation } from 'swiper';
import Blockchainjson from '../../../../assets/blockchainjson/arrayOfBlockchain.json'
 

SwiperCore.use([Navigation]);
@Component({
  selector: 'app-search-collection',
  templateUrl: './search-collection.component.html',
  styleUrls: [
    './search-collection.component.scss',
    './../collections/allcollection/allcollection.component.scss',
  ],
})
export class SearchCollectionComponent implements OnInit, OnDestroy {
  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 50,

    navigation: true,
    scrollbar: { draggable: true },
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

  slider: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,

    scrollbar: { draggable: true },
  };
  isApiLoading: boolean = true;
  discoverNFTList: any = [];
  dicoverCollectionList: any = [];
  connectedAddress: any;
  searchKey: any = 'all';
  minPrice: any = 0;
  maxPrice: any = 50000;
  priceSort: string = '';
  sortingType: any = '2';
  priceRangeMin: any = 0;
  priceRangeMax: any = 100;
  orderBy: any = 'DESC';
  size: any = environment.paginationSize;
  sortByPrice: any = 1;
  blockchainList: any = Blockchainjson.blockchain;

  currencySymbol = this.blockchainList[0].networkName;
  blockchainId: any = 1;
  categotyList: any = Blockchainjson.category;
  categoryName: any='Select';
  categoryId: any = 1;

  regardingDropdown: any = 'collections';
  createrList: any = [];
  unSubscribeSubscription: Subscription;
  unSubribeDescoverCollectionList: Subscription;
  collectionListPage:number =1;
  collectionListSize:number = environment.paginationSize;
  creatorsListPage:number =1;
  creatorsListSize:number = environment.paginationSize;
  nftlistPage :number =1; 

  constructor(
    private homeService: HomeService,
    private cs: ContractService,
    private activatedRoute: ActivatedRoute,
    private dataService: CollectionApiService,
    private router: Router,
    private createNFT: CreateNftService,
    private ngxService: NgxUiLoaderService,
    private getDataservice :GetDataService,
    private _titleService : Title,
    private _meta:Meta
  ) { }
  ngOnDestroy(): void {
    if (this.unSubscribeSubscription) {
      this.unSubscribeSubscription.unsubscribe();
    }

    if (this.unSubribeDescoverCollectionList) {
      this.unSubribeDescoverCollectionList.unsubscribe();
    }
  }

  ngOnInit(): void {
    let that = this;
    this._titleService.setTitle('Search Collection');
    this._meta.updateTag({name:'description' ,content:'search Collection page'});
    window.onclick = function (event) {
      if (
        !event.target.matches('.dropdown *') ||
        event.target.matches('.dropdown-content *')
      ) {
        that.outsideClick();
      }
    };

    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
    });

    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.searchKey = res.searchKey;
      if (!res.searchKey) {
        this.searchKey = 'all';
      }
      this.dicoverCollectionList = [];
      this.getCollection();
    });

    // this.getBlockchainList();
    // this.getCategotyList();
  }

  outsideClick() {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
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

  getSearchResultNFT() {
    let url: any;
    this.ngxService.start();
    if (this.searchKey.toLowerCase() == 'all') {
      url =
        'home/getNftSearchResult?' +
        'sortingType=' +
        this.sortingType +
        '&priceRangeMin=' +
        this.minPrice +
        '&priceRangeMax=' +
        this.maxPrice +
        '&pageNo='+
        this.nftlistPage +
        '&size=' +
        this.size +
        '&walletAddress=' +
        this.connectedAddress +
        '&searchText=' +
        '' +
        '&blockchainId=' +
        this.blockchainId +
        '&categoryId=' +
        this.categoryId;
    } else {
      url =
        'home/getNftSearchResult?' +
        'sortingType=' +
        this.sortingType +
        '&priceRangeMin=' +
        this.minPrice +
        '&priceRangeMax=' +
        this.maxPrice +
        '&pageNo='+
        this.nftlistPage +
        '&size=' +
        this.size +
        '&walletAddress=' +
        this.connectedAddress +
        '&searchText=' +
        this.searchKey +
        '&blockchainId=' +
        this.blockchainId +
        '&categoryId=' +
        this.categoryId;
    };
    this.unSubscribeSubscription = this.dataService.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          
          res.data.forEach((element:any) => {
            this.discoverNFTList.push(element)
          });
          
          this.isApiLoading = false;
          this.ngxService.stop();
        } else {
          this.ngxService.stop();

        }
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  getCollection() {
    this.ngxService.start();
    let url;
    if (this.searchKey.toLowerCase() == 'all') {
      url =
        'home/getCollectionSearchResult?searchText=' +
        '' +
        '&priceRangeMin=' +
        this.minPrice +
        '&priceRangeMax=' +
        this.maxPrice +
        '&blockchainId=' +
        this.blockchainId +
        '&categoryId=' +
        this.categoryId +
        '&status=' +
        this.sortingType +
        '&pageNo='+
        this.collectionListPage +
        '&PageSize='+
        this.collectionListSize;
    } else {
      url =
        'home/getCollectionSearchResult?searchText=' +
        this.searchKey +
        '&priceRangeMin=' +
        this.minPrice +
        '&priceRangeMax=' +
        this.maxPrice +
        '&blockchainId=' +
        this.blockchainId +
        '&categoryId=' +
        this.categoryId +
        '&status=' +
        this.sortingType +
        '&pageNo='+
        this.collectionListPage +
        '&PageSize='+
        this.collectionListSize;
    }

    this.unSubribeDescoverCollectionList = this.dataService.getRequest(url).subscribe(
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
                response.data[i].asset =
                response.data[i].nftDetailsList[0].asset;
            }
          }
          response.data.forEach((element:any) => {
            this.dicoverCollectionList.push(element)
          });
          this.getDataservice.searchCollectionflag.next(1);
          this.ngxService.stop();
        } else {
          this.ngxService.stop();
        }
      },
      (err) => {
        this.ngxService.stop();
      }
    );
  }

  loadmoreNftList(){
    this.nftlistPage = this.nftlistPage +1;
    this.getSearchResultNFT(); 
  }

  loadmoreCollectionList(){
    this.collectionListPage = this.collectionListPage + 1;
    this.getCollection();
  }

  loadmoreCreatorsList(){
    this.creatorsListPage = this.creatorsListPage + 1;
    this.getCreaterList();
  }


  gotoNftDetails(nftAddress: any, id: any,blockchainId) {
    this.router.navigate(['/details', nftAddress, id ,blockchainId]);
  }

  getBlockchainList() {
    this.createNFT.getBlockchainList().subscribe((response: any) => {
      this.blockchainList = response.data;
      this.currencySymbol = this.blockchainList[0].networkName;
      this.blockchainId = 1;
    });
  }
  getCategotyList() {
    this.createNFT.getCategotyList().subscribe((response: any) => {
      if (response.isSuccess) {
        this.categotyList = response.data;
        this.categoryId = 1;
        // this.categoryName = this.categotyList[0].categoryName;
      }
    });
  }

  /**
   *
   * filter Api's
   */

  filter(searchText: any, col: any) {
    if (searchText == '') {
      this.searchKey = 'all';
    } else {
      this.searchKey = searchText;
    }
    if (this.regardingDropdown == 'items') {
      this.getSearchResultNFT();
    }

    if (this.regardingDropdown == 'collections') {
      // this.dicoverCollectionList =[];
      this.router.navigate(['/searchcollection'], {
        queryParams: { searchKey: searchText },
      });
      this.getCollection();
    }

    if (this.regardingDropdown == 'creators') {
      this.getCreaterList();
    }
  }

  getListofCollection01(blockchainId: any, currencySymbol: any, col: any) {
    this.blockchainId = blockchainId;
    this.currencySymbol = currencySymbol;
    this.dicoverCollectionList = [];
    this.discoverNFTList = [];
    if (this.regardingDropdown == 'collections') {
      this.getCollection();
    }

    if (this.regardingDropdown == 'items') {
      this.getSearchResultNFT();
    }
  }

  getNftlistbyCategory(categoryId: any, categoryName: any, col: any) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.dicoverCollectionList = [];
    this.discoverNFTList = [];
    if (this.regardingDropdown == 'collections') {
      this.getCollection();
    }

    if (this.regardingDropdown == 'items') {
      this.getSearchResultNFT();
    }
  }

  filter001() {
    if (this.regardingDropdown == 'collections') {
      this.getCollection();
    }

    if (this.regardingDropdown == 'items') {
      this.getSearchResultNFT();
    }
  }
  sortingType01(value: any) {
    this.sortingType = value;
    this.discoverNFTList = [];
    this.nftlistPage = 1;
    this.getSearchResultNFT();
  }
  sortingType0101(value: any) {
    this.sortingType = value;
    this.dicoverCollectionList = [];
    this.collectionListPage = 1;
    this.getCollection();
  }
  getRegarding(value: any) {

    this.regardingDropdown = value;
    if (this.regardingDropdown == 'creators') {
      this.getCreaterList();
    }
    if (this.regardingDropdown == 'items') {
      this.getSearchResultNFT();
    }
    if (this.regardingDropdown == 'collections') {
      this.getCollection();
    }
  }

  getCreaterList() {
    let url: any;
    if (this.searchKey.toLowerCase() == 'all') {
      url =
        'home/getCreatorsList?searchText=' + '' + '&status=' + this.sortingType+'&pageNo='+
        this.creatorsListPage +
        '&PageSize='+
        this.creatorsListSize;;
    } else {
      url =
        'home/getCreatorsList?searchText=' +
        this.searchKey +
        '&status=' +
        this.sortingType+'&pageNo='+
        this.creatorsListPage +
        '&PageSize='+
        this.creatorsListSize;
    }

    this.dataService.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          res.data.forEach((element:any) => {
            this.createrList.push(element)
          });
          
        } else {
        }
      },
      (err: any) => { }
    );
  }

  creator01(value: any) {
    this.sortingType = value;
    this.creatorsListPage = 1;
    this.getCreaterList();
  }

  clearSearch() {
    this.searchKey = 'all';
    document.getElementById('textSearch').innerHTML = 'all';
    if (this.regardingDropdown == 'creators') {
      this.router.navigate(['/searchcollection'], { relativeTo: this.activatedRoute, queryParams: { }});
      this.getCreaterList();
    }
    if (this.regardingDropdown == 'items') {
      this.router.navigate(['/searchcollection'], { relativeTo: this.activatedRoute, queryParams: { }});
      this.getSearchResultNFT();
    }
    if (this.regardingDropdown == 'collections') {
      this.router.navigate(['/searchcollection'], { relativeTo: this.activatedRoute, queryParams: { }});
      this.getCollection();
    }
  }

  myFunction() {
    this.outsideClick();
    document.getElementById('myDropdown').classList.toggle('show');
  }

  myFunction1() {
    this.outsideClick();
    document.getElementById('myDropdown1').classList.toggle('show');
  }

  myFunction2() {
    this.outsideClick();
    document.getElementById('myDropdown2').classList.toggle('show');
  }

  myFunction3() {
    this.outsideClick();
    document.getElementById('myDropdown3').classList.toggle('show');
  }

  onSearchFieldClicked() {
    if (this.searchKey == 'all')
      this.searchKey = '';
  }
  // document.getElementById("editor").addEventListener("input", inputEvt => {
  // }, false);
}
