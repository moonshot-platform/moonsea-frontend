import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { HomeService } from 'src/app/services/home.service';
import SwiperCore, { SwiperOptions, Navigation, Grid } from 'swiper';
import { GetDataService } from 'src/app/services/get-data.service';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { BetaversionModalComponent } from './betaversion-modal/betaversion-modal.component';
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
export class LandingComponent implements OnInit, OnDestroy {

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
  newCollection: any = [];
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

  defaultImage = 'assets/media/videos/moonsea-animated-logo.webm';
  loaded: boolean;
  loaded01: boolean;
  loaded02: boolean;

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
      {
        name: 'og:description',
        content:
          'A Multi Chain NFT Marketplace',
      },
      { name: 'og:title', content: 'Moonsea' },
      {
        name: 'og:image',
        itemprop: 'image',
        content:
          'https://ui8-crypter-nft-html.herokuapp.com/img/content/photo-2.1.jpg',
      },
    ]);
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    const viewport = this.meta.getTag('name="og:description"');
    const viewport1 = this.meta.getTag('name="og:title"');
    const viewport2 = this.meta.getTag('name="og:image"');

    if (viewport) {
      this.meta.removeTagElement(viewport);
    }
    if (viewport1) {
      this.meta.removeTagElement(viewport1);
    }
    if (viewport2) {
      this.meta.removeTagElement(viewport2);
    }
  }
  discoverNFTList = [];
  oldtype: any;
  oldorderBy: any;
  oldpriceRange: any;
  isApiLoading: boolean = true;
  browsCategory: any;
  upCommingCollection: any = [];
  getCollectionDetails: any = [];
  getTopcollection: any = [];

  ngOnInit() {
    if ((localStorage.getItem('item') ?? '0') != '1') {
      this.openDialog();
    }

    localStorage.setItem('item', '1');

    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
    });
    this.getUpcomingCollection();
  }

  getUpcomingCollection(){
    this.ngxService.start();
    this.homeService.getUpcommingCollection().subscribe((response: any) => {
      this.ngxService.stop();
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

      this.newCollection = response.data;
    }, (err: any) => {
      this.ngxService.stop();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(BetaversionModalComponent, {
      width: '40%',
      backdropClass: 'popupBackdropClass',
      panelClass: 'removeShadow',
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }



  goToCallection(data: any) {
    this.router.navigate(['collections/', data]);
  }
  goToDiscoverNFT() {
    this.router.navigate(['discover']);
  }

  goToSignleNFT() {
    this.router.navigate(['/createNft']);
  }

  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 50,
    pagination: { clickable: false },
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

  newCollectionslider: SwiperOptions = {
    slidesPerView: 1,
    grid: {
      rows: 3,
    },
    navigation: true,

    scrollbar: { draggable: true },
  };

  stats() {
    this.router.navigate(['/others/stats']);
  }

  searchClient(searchText: any) {
    this.router.navigate(['/searchcollection'], {
      queryParams: { searchKey: searchText },
    });
  }

  arraymove(arr, fromIndex, toIndex) {
    let prmise = new Promise((resolve, rejects) => {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      resolve('a');
    });

    return prmise;
  }

  gotoNftDetails(nftAddress: any, id: any) {
    this.router.navigate(['details', nftAddress, id]);
  }
}
