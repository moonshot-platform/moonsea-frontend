import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { HomeService } from 'src/app/services/home.service';
import SwiperCore, { SwiperOptions, Navigation, Grid } from 'swiper';
import { GetDataService } from 'src/app/services/get-data.service';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { BetaversionModalComponent } from './betaversion-modal/betaversion-modal.component';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { Meta } from '@angular/platform-browser';

SwiperCore.use([Grid, Navigation]);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [
    './landing.component.scss',
    './../moonbase.component.scss',
    './../intro/intro.component.scss',
  ],
})
export class LandingComponent implements OnInit ,OnDestroy{
  static readonly routeName: string = '';

  boxes: any[] = [
    {
      img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/photo-1.1.jpg',
      name: 'The creator network',
      design: 'Enrico Cole',
      quantity: '112 items',
    },
    {
      img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/photo-2.1.jpg',
      name: 'The creator network',
      design: 'Enrico Cole',
      quantity: '112 items',
    },
    {
      img: 'https://ui8-crypter-nft-html.herokuapp.com/img/content/photo-3.1.jpg',
      name: 'The creator network',
      design: 'Enrico Cole',
      quantity: '112 items',
    },
  ];

  data: any;
  hotCollectionList: any;
  getTopSellerCreatorsList: any;
  hotBidList: any;
  connectedAddress: any;
  slidesPerView = 1;
  newCollection :any = [];
  nullImg = './../../../assets/img/WPngtreectoruserssicon3762775.png';
  tabHeadings = [
    'On Sale',
    'Owned',
    'Created',
    'Likes',
    'Following',
    'Followers',
  ];
  tabHeadingsUrl = [
    'onSale',
    'owned',
    'created',
    'likes',
    'following',
    'followers',
  ];
  listItemsCreated: any;
  slider_img = [
    {
      img: './../../../assets/img/slider/ezgif.com-gif-maker.jpg',
      title: 'A house fire, or something like that. ',
      artist: 'JoeythePhotographer',
    },
    {
      img: './../../../assets/img/slider/ezgif.com-gif-maker (1).jpg',
      title: 'A house fire, or something like that. 2',
      artist: 'JoeythePhotographer 2',
    },
  ];
  getHotBidCollectionList: any;
  flag: boolean = false;
  searchResult: any;
  statics: any = {};
  constructor(
    private homeService: HomeService,
    private cs: ContractService,
    private router: Router,
    private getDataService: GetDataService,
    public pricingApi: PricingApiService,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog,
    private meta: Meta
  ) {
    this.meta.addTags([
      { name: 'og:description', content: 'A cross-chain NFT Marketplace engineered by Moonshot for Artists & Creators.' },
      { name: 'og:title', content: 'Moonsea' },
      {  name:"og:image" ,itemprop:"image",content:'https://ui8-crypter-nft-html.herokuapp.com/img/content/photo-2.1.jpg'}
    ]);
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    const viewport = this.meta.getTag('name="og:description"');
    const viewport1 = this.meta.getTag('name="og:title"');
    const viewport2 = this.meta.getTag('name="og:image"');

    if (viewport){ this.meta.removeTagElement(viewport);}
    if (viewport1) {this.meta.removeTagElement(viewport1);}
    if (viewport2){ this.meta.removeTagElement(viewport2);}


  }
  discoverNFTList = [];
  oldtype: any;
  oldorderBy: any;
  oldpriceRange: any;
  isApiLoading: boolean = true;
  browsCategory: any;
  upCommingCollection:any=[];
  getCollectionDetails:any=[];
  getTopcollection:any=[];

  
  ngOnInit() {

    if ((localStorage.getItem("item") ?? "0") != "1") {
      this.openDialog();
    }

    localStorage.setItem("item", "1");
    
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      this.getCollectionList();
      // this.HomePageList(1, 'DESC', 1, 12);
    });

  }

  firstApi: boolean = false;
  secondApi: boolean = false;
  thirdApi: boolean = false;
  fourthApi: boolean = false;
  fifthApi: boolean = false;

  openDialog() {
    const dialogRef = this.dialog.open(BetaversionModalComponent, {
      width: '40%',
      backdropClass: 'popupBackdropClass',
      panelClass: 'removeShadow',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getCollectionList() {
    this.ngxService.start();
    this.hotCollectionList = [];
    this.homeService
      .getCollectionList(this.connectedAddress)
      .subscribe((response: any) => {
       
        if(response.isSuccess){
          this.getCollectionDetails = response.data;
          // console.log("get collectionDetais=>", this.getCollectionDetails);
        }

        this.ngxService.stop();
        this.firstApi = true;
      });


    this.homeService.getHotBidCollectionList().subscribe((response: any) => {
     
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
      this.hotCollectionList = response.data;
      this.secondApi = true;
    });

    this.homeService.getNewCollections().subscribe((response: any) => {
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

      this.newCollection = response.data;
      console.log("new collection ",this.newCollection);
      
      
      this.thirdApi = true;
    });

    this.homeService
      .getBrowseBycategoryCollectionList()
      .subscribe((res: any) => {
        this.browsCategory = res.data;
        this.fourthApi = true;
      });

    this.homeService.getHompageStatics().subscribe((res: any) => {
      this.statics = res.data;
      this.fifthApi = true;
    });


    this.homeService.getUpcommingCollection().subscribe(
      (response:any)=>{
        if(response.isSuccess){
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
          this.upCommingCollection = response.data;
          // console.log(this.upCommingCollection);
          
        }
        
      }
    )

    this.homeService.getTopCollectionlist().subscribe(
      (response:any)=>{
        if(response.isSuccess){
          
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

          this.getTopcollection = response.data;
        }
        
      }
    )

    // if(this.firstApi && this.secondApi && this.thirdApi && this.fourthApi  && this.fifthApi){
    //   this.spinner.hide();
    // }
  }
  

  goToCallection(data: any) {
    this.router.navigate(['collections/', data]);
  }
  goToDiscoverNFT() {
    this.router.navigate(['discover']);
  }

  goToSignleNFT() {
    this.router.navigate(['/createNFT/createNft']);
  }

  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 50,
    pagination: { clickable: true },
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
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  
  newCollectionslider: SwiperOptions = {
    slidesPerView: 1,
    grid: {
      rows: 3
    },
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  stats() {
    this.router.navigate(['/stats']);
  }

  searchClient(searchText: any) {
    //  if(searchText.length > 3){
    //   this.getDataService.searchResult(
    //     searchText
    //   ).subscribe(
    //     response => {
    //       this.searchResult = response.data;

    //     });
    //  }
    this.router.navigate(['/searchcollection'], {
      queryParams: { searchKey: searchText },
    });
  }

  uniquedata :any=[];
  properties:any= [];
  autoComplete(searchText) {
    this.uniquedata =[];
    this.properties= [];
    if (searchText.length > 2) {
      this.getDataService.searchResult(searchText).subscribe(async (response) => {
        if (response.isSuccess) {
          this.flag = true;
          this.searchResult = response.data;
          this.searchResult.forEach(element => {
              if(this.uniquedata.indexOf(element.serachType) === -1){
                this.uniquedata.push(element.serachType);
              }
          });

         await this.arraymove(this.uniquedata,2,1);
          

          this.uniquedata.forEach((element:any,index:any) => {
            this.properties[index] = [];
            this.searchResult.forEach((el:any) => {
                if(el.serachType == element){
                  this.properties[index].push(el)
                }
            });
          });
          console.log(this.uniquedata);
          console.log(this.properties);
          
        }else{
          this.flag = false;
        }
      });
    }
    else{
      this.flag = false;
    }
  }


  arraymove(arr, fromIndex, toIndex) {
    let prmise = new Promise((resolve,rejects)=>{
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      resolve('a')

    })
 
    return prmise;
  
}

  onselectClient(enterText: any, serachType: any, nftToken: any,nftAddress:any) {
  
   
    if (serachType == 1) {
      this.router.navigate(['/details',nftAddress, nftToken]);
    } else if (serachType == 2) {
      this.router.navigate(['/profile/profile', enterText]);
    } else if (serachType == 4) {
      this.router.navigate(['/profile/profile', enterText]);
    } else {
      this.router.navigate(['collection', enterText]);
    }
  }

  gotoNftDetails(nftAddress: any, id: any) {
    console.log(nftAddress, '=====', id);

    this.router.navigate(['/createNFT/details', nftAddress, id]);
  }

  defaultImage = "assets/images/default.jpg";
}
