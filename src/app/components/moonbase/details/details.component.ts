import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPopUpComponent } from '../details-pop-up/details-pop-up.component';
import { ToastrService } from 'ngx-toastr';
import { ShearWithMediaComponent } from '../shared/popups/shear-with-media/shear-with-media.component';
import { GetDataService } from 'src/app/services/get-data.service';
import { ContractService } from 'src/app/services/contract.service';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Title, Meta } from '@angular/platform-browser';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import blockjson from '../../../../assets/blockchainjson/blockchain.json';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Input() ID: any;
  data: any;
  nftTokenID: any;
  Address: any | null;
  isLikeByYou: any;
  currentPrice: any;
  currentSupply: any;
  propertyS: any;
  isConnected = false;
  ownersData: any = [];
  indexForPurchase: number = -1;
  indexForPlaceBid: any = -1;
  apiDataLoaded: boolean = false;
  private urlHistory: string[] = [];
  dialogRef: any;
  metatagsName = [
    'name="twitter:site"',
    'name="twitter:card"',
    'name="twitter:site"',
    'name="twitter:title"',
    'twitter:description',
    'twitter:image',
    '',
  ];
  nftAddress: any;

  unSubscribeRequest: Subscription;
  unSubscribeRequest01: Subscription;
  elementsHasLoaded: boolean[] = [];
  isImgLoaded: boolean = false;
  blockchainInfo: any = {};
  correntRoute: any;
  queryBlockchainId: any;
  asset: any;
  constructor(
    public dialog: MatDialog,
    private getDataService: GetDataService,
    private _activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private contractService: ContractService,
    public pricingApi: PricingApiService,
    private location: Location,
    private collectionApi: CollectionApiService,

    private ngxService: NgxUiLoaderService,
    private meta: Meta,
    private titleService: Title,
    private http: HttpClient,
    private route:Router,
  ) {
    for (let index = 0; index < 100; index++) {
      this.elementsHasLoaded[index] = false;
    }
  }
  ngOnDestroy(): void {
    if (this.unSubscribeRequest) {
      this.unSubscribeRequest.unsubscribe();
    }
    if (this.unSubscribeRequest01) {
      this.unSubscribeRequest01.unsubscribe();
    }

  }

  ngOnInit(): void {
    this.titleService.setTitle('Details');
    this.meta.addTags([
      { name: 'Details', content: 'You can sea nft details at this page...' },
    ]);
    this.correntRoute = window.location.href;
    window.scrollTo(0, 0);
    this._activatedRoute.params.subscribe((params) => {
      this.nftTokenID = params['nftTokenID'];
      this.nftAddress = params['nftAddress'];
      this.queryBlockchainId = params['blockchainId'];
    });
    this.route.routeReuseStrategy.shouldReuseRoute = function(){return false;};
    // this._activatedRoute.queryParams.subscribe((res: any) => {
    //   this.queryBlockchainId = res['blockchainId'];
    //   this.asset = res['asset'];
    // })

    this.ID = this.nftTokenID;

    this.contractService.getWalletObs().subscribe((data: any) => {
      if (this.Address != data) {
        this.Address = data;
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }
      this.nftDetails(this.nftTokenID, this.Address);

    });

    // this.getList();
    this.pricingApi.getPriceofBNB();
    this.pricingApi.getServiceFee();
  }


  @HostListener('document:click', ['$event'])
  onMouseEnter(event: any) {
    if (!document.getElementById('dropdownButton').contains(event.target)) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DetailsPopUpComponent, {
      width: 'auto',
      data: {
        ID: this.ID,
        currentPrice: this.currentPrice,
        isListed: this.data.isListed,
        typeOfSale: this.data.typeOfSale,
        nftTokenID: this.data.nftTokenID,
        price: this.data.price,
        supply: this.data.supply,
        nftAddress: this.data.nftAddress,
        isMultiple: this.data.isMultiple,
        currentSupply: this.data.currentSupply,
        collectionId: this.data.collectionId,
        blockchainId: this.data.blockchainId,
        royalties: this.data.royalties,
        royaltiesOwner: this.data.royaltiesOwner,
        tokenAddress: this.data.contractAddress,
        ownerCurrentSupply: this.data.ownerCurrentSupply,
        asset: this.asset
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  openDialogForShear(): void {
    const dialogRef = this.dialog.open(ShearWithMediaComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  async nftDetails(nftTokenId: any, walletAddress: any) {
    this.ngxService.start();
    this.unSubscribeRequest = this.getDataService
      .nftDetails(nftTokenId, walletAddress, this.nftAddress, this.queryBlockchainId)
      .subscribe(
        (response: any) => {
          this.ngxService.stop();
          this.data = response.data;
          
          this.asset = this.data?.asset;
          this.getList();

          blockjson[environment.configFile].forEach(element => {
            if (element.blockchainId == this.data?.blockchainId) {
              this.blockchainInfo = element;
            }
          });


          const storetemp = {
            owner: this.data?.title,
            byOwner: this.data?.tokenName,
          };
          localStorage.setItem('purchaseMode', JSON.stringify(storetemp));

          this.apiDataLoaded = true;
          this.isLikeByYou = this.data?.isLikeByYou;
          this.currentPrice = this.data?.price;
          this.currentSupply = this.data?.currentSupply;
          this.propertyS = this.data?.properties;
        },
        (err) => {
          this.ngxService.stop();
        }
      );
  }

  async Liked(nftId: any) {
    if (!this.contractService.checkValidAddress(this.Address)) {
      this.connectWallet();
      return false;
    }
    var status: any = await this.contractService.signMsgForLiked(nftId);
    if (status.status) {
      this.getDataService
        .likedNft({
          nftId: nftId,
          walletAddress: this.Address,
          signature: status.signature,
          nftAddress: this.data?.nftAddress,
          blockchainId: this.data?.blockchainId,
          asset: this.asset
        })
        .subscribe((result: any) => {
          if (result.isSuccess) {
            this.toastrService.success(result.message);

            this.data.isLikeByYou = 1;
          } else {
            this.toastrService.error(result.message)
          }
        });
    }
    return false;
  }

  async UnLiked(nftId: any) {
    if (!this.contractService.checkValidAddress(this.Address)) {
      this.connectWallet();
    }
    var status: any = await this.contractService.signMsgForUnLiked(
      nftId.toString()
    );
    if (status.status) {
      this.getDataService
        .unlikeNft({
          id: nftId,
          walletAddress: this.Address,
          signature: status.signature,
          asset: this.asset
        })
        .subscribe((result: any) => {
          if (result.isSuccess) {
            this.toastrService.success(result.message);
            this.isLikeByYou = 0;
            this.data.isLikeByYou = 0;
          }
        });
    }
    return false;
  }

  onMediaLoad(event, index) {
    if (event && event.target) {
      this.elementsHasLoaded[index] = true;
    } else {
      this.elementsHasLoaded[index] = false;
    }

    if (event.readyState == 4) {
      this.elementsHasLoaded[index] = true;
    }
  }




  connectWallet() {
    this.dialog.open(ConnectWalletPopupComponent, {
      height: 'auto',
      width: 'auto',
    });
  }

  async getList() {
    this.unSubscribeRequest01 = this.getDataService
      .getListOwners(this.ID, this.Address, this.nftAddress, this.queryBlockchainId, this.asset)
      .subscribe((response: any) => {
        if (response.isSuccess) {

          this.ownersData = response.data;


          let i = 0;
          this.ownersData.forEach((value: any, index: any) => {
            if (value.typeOfSale == 1 && this.indexForPurchase == -1) {
              this.indexForPurchase = index;
            } else if (
              (value.typeOfSale == 2 || value.typeOfSale == 3) &&
              this.indexForPlaceBid == -1
            ) {
              this.indexForPlaceBid = index;
            }
          });
          this.apiDataLoaded = true;


        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  refresh() {
    let url =
      'api/refreshData?nftAddress=' +
      this.data.nftAddress +
      '&nftTokenId=' +
      this.data.nftTokenID + '&asset=' + this.asset;
    this.collectionApi.getRequest(url).subscribe((response: any) => {
      this.toastrService.success(
        "We've queued this item for an update! Check back in a minute...."
      );
    });
  }
  base64Image: any;

  downloadImages(imageUrl: any) {
    //debugger;
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "mrHankey.jpg");
      link.click();
    });
  }

  getBase64ImageFromURL(url: string) {
    //debugger
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }


  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }






  openSharedrop() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
}
