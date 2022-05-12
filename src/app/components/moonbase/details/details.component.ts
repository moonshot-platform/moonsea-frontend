import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPopUpComponent } from '../details-pop-up/details-pop-up.component';
import { ToastrService } from 'ngx-toastr';
import { ShearWithMediaComponent } from '../shared/popups/shear-with-media/shear-with-media.component';
import { GetDataService } from 'src/app/services/get-data.service';
import { ContractService } from 'src/app/services/contract.service';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { JsonPipe, Location } from '@angular/common';
import { PurchaseNowModalComponent } from '../nft-card/purchase-now-modal/purchase-now-modal.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Title, Meta } from '@angular/platform-browser';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit ,OnDestroy {
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

  unSubscribeRequest :Subscription;
  unSubscribeRequest01: Subscription;

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
    private titleService: Title
  ) {}
  ngOnDestroy(): void {
    if(this.unSubscribeRequest){
    this.unSubscribeRequest.unsubscribe();
    }
    if(this.unSubscribeRequest01){
      this.unSubscribeRequest01.unsubscribe();
    }
   
  }

  ngOnInit(): void {
    // const charsetTag = this.meta.getTag('name="twitter:site"');
    // if (charsetTag) this.meta.removeTagElement(charsetTag);
    this.meta.addTags([
      { name: 'Details', content: 'You can sea nft details at this page...' },
    ]);

    window.scrollTo(0, 0);
    this._activatedRoute.params.subscribe((params) => {
      console.log(params);
      
      this.nftTokenID = params['nftTokenID'];
      this.nftAddress = params['nftAddress'];
      
    });
    this.ID = this.nftTokenID;

    this.contractService.getWalletObs().subscribe((data: any) => {
      if (data !== undefined && data != this.data) {
        this.Address = data;
        this.isConnected = true;
        this.nftDetails(this.nftTokenID, this.Address);
      } else {
        this.isConnected = false;
      }
    });

    this.nftDetails(this.nftTokenID, this.Address);
    this.getList();
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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogForShear(): void {
    const dialogRef = this.dialog.open(ShearWithMediaComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  async nftDetails(nftTokenId: any, walletAddress: any) {
    this.ngxService.start();
    this.unSubscribeRequest = this.getDataService
      .nftDetails(nftTokenId, walletAddress, this.nftAddress)
      .subscribe(
        (response: any) => {
          this.ngxService.stop();
          this.data = response.data;

          const storetemp = {
            owner: this.data.title,
            byOwner: this.data.tokenName,
          };
          localStorage.setItem('purchaseMode', JSON.stringify(storetemp));

          this.apiDataLoaded = true;
          this.isLikeByYou = this.data.isLikeByYou;
          this.currentPrice = this.data.price;
          this.currentSupply = this.data.currentSupply;
          this.propertyS = this.data.properties;
        },
        (err) => {
          this.ngxService.stop();
        }
      );
  }

  async Liked(nftId: any, walletAddress: string) {
    if (!this.contractService.checkValidAddress(this.Address)) {
      this.connectWallet();
      return false;
    }
    var status: any = await this.contractService.signMsgForLiked(this.Address);
    if (status.status) {
      this.getDataService
        .likedNft({
          nftId: nftId,
          walletAddress: this.Address,
          signature: status.signature,
        })
        .subscribe((result: any) => {
          if (result.isSuccess) {
            this.toastrService.success(result.message);

            this.isLikeByYou = 1;
          } else {
            // this.toastrService.error(result.message)
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
        })
        .subscribe((result: any) => {
          if (result.isSuccess) {
            this.toastrService.success(result.message);
            this.isLikeByYou = 0;
          }
        });
    }
    return false;
  }

  connectWallet() {
    this.dialog.open(ConnectWalletPopupComponent, {
      height: 'auto',
      width: 'auto',
    });
  }

  async getList() {
 this.unSubscribeRequest01 = this.getDataService
      .getListOwners(this.ID, this.Address, this.nftAddress)
      .subscribe((response: any) => {
        if (response.isSuccess) {

          this.ownersData = response.data;
          
          
          let i = 0;
          this.ownersData.forEach((value: any, index: any) => {
            // console.log(value.typeOfSale)
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
      this.data.nftTokenID;
    this.collectionApi.getRequest(url).subscribe((response: any) => {
      this.toastrService.success(
        "We've queued this item for an update! Check back in a minute...."
      );
    });
  }
}
