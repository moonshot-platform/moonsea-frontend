import { Component, OnInit, Input, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ethers } from 'ethers';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { ToastrService } from 'ngx-toastr';
import { SignBuyerOrder } from 'src/app/model/signBuyerOrder';
import { CollectionApiService } from 'src/app/services/collection-api.service';

import blockjson from '../../../../../assets/blockchainjson/blockchain.json';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-place-bid-modal',
  templateUrl: './place-bid-modal.component.html',
  styleUrls: ['./place-bid-modal.component.scss'],
})
export class PlaceBidModalComponent implements OnInit {
  balanceInBNB: any = '';
  price: any;
  invalidValue = true;
  btnText = 'Place bid';
  serviceFees: number = 0;
  serviceFeesVal: number = 0;
  wrongNetwork: boolean = false;
  step = 0;
  isShowMinimumBidValidation: boolean;
  bidAmont: any;

  public SignBuyerOrderModel: SignBuyerOrder = new SignBuyerOrder();

  balanceDetailsToken!: { balance: any; status: boolean; decimals: any };
  tokenAddress: any;
  blockchainInfo:any ={};
  


  constructor(
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    private dialogRef: MatDialogRef<PlaceBidModalComponent>,
    private nftInteractionService: NftInteractionService,
    private pricingDetails: PricingApiService,
    private toastr: ToastrService,
    private collectionApiService: CollectionApiService
  ) {
    this.serviceFeesVal = pricingDetails.serviceFees;
  }

  ngOnInit(): void {
    this.pricingDetails.getServiceFee();
    this.price = this.items.listing.price;
    this.serviceFees =  this.price * this.pricingDetails.serviceFees/100;
    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.items.listing.blockchainId){
        this.blockchainInfo = element;
      }
    });
    this.getAccount();
    this.checkNetwork();

   
  }

  async checkNetwork() {
    debugger
    let checkNetwork: boolean = await this.contractService.createContract(
      this.items.listing.blockchainId
    );

    if (!checkNetwork) {
      this.wrongNetwork = true;
      this.step = 0;
      let chainIdd = this.contractService.chainId;
      // chainIdd = parseInt(chainIdd);
      // chainIdd = chainIdd.toString(16);
      debugger
    try {
      let switchNetwork = this.contractService.switchNetwork(chainIdd);

      switchNetwork.then(
        (res: any) => {
          if (res == 'doneeeeee') {
            this.wrongNetwork = false;
            this.step = 1;
            // this.getAccount();
            this.dialogRef.close();
          }
        },
        (err: any) => {
          this.wrongNetwork = true;
          this.step = 0;
          console.log(err);
          
        }
      ).catch((e:any)=>{
        console.log(e);
        
      })
    } catch (error) {
      console.log(error);
      
    }
      
    } else {
      this.wrongNetwork = false;
      this.step = 1;
    }
  }

  async getAccount() {
    debugger
    this.tokenAddress = this.contractService.getAddressWeth(
      this.items.listing.blockchainId
    );
    this.balanceDetailsToken = await this.contractService.getTokenBalance(
      this.tokenAddress
    );
    this.balanceInBNB =
      this.balanceDetailsToken.balance > 0
        ? (
            this.balanceDetailsToken.balance /
            10 ** this.balanceDetailsToken.decimals
          ).toFixed(4)
        : '0';
    this.price = this.items.listing.price / this.items.listing.supply;
    this.invalidValue = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validatePrice(event: any) {
    this.bidAmont = event.target.value;
    if (this.price > event.target.value) {
      this.invalidValue = true;
      this.isShowMinimumBidValidation = true;
    } else {
      this.invalidValue = false;
      this.serviceFees = this.bidAmont * this.pricingDetails.serviceFees/100;
      this.isShowMinimumBidValidation = false;
    }
  }

  checkBalance(amount: any) {
    debugger
    if (
      this.balanceDetailsToken.balance >=
      amount * 10 ** this.balanceDetailsToken.decimals
    ) {
      return true;
    } else {
      this.toastr.error('Insufficient balance');
      return false;
    }
    return false;
  }
  async approveToken(amount: any) {
    debugger;

    if (this.checkBalance(amount)) {
      try {
        let allowance: any = await this.contractService.checkAllowance(
          this.tokenAddress,
          amount
        );
        if (allowance.status && allowance.allowance) {
          this.PlaceBid(amount);
        } else if (allowance.status && !allowance.allowance) {
          this.btnText = 'Approve Token';

          let allowToken: any = await this.contractService.approveToken(
            amount,
            this.tokenAddress
          );

          if (allowToken.status) {
            allowToken.hash.wait(3);
            this.btnText = 'Waiting for tokenApproval';
            this.PlaceBid(amount);
          }
        }
      } catch (e) {
        this.btnText = 'Place bid';
      }
    }
  }

  async PlaceBid(amount: any) {
    debugger;
    let salt = this.contractService.randomNo();
    // const params2 = ethers.utils.parseEther(amount.toString());
    this.btnText = 'Waiting for signature';
    this.SignBuyerOrderModel.salt = salt;
    this.SignBuyerOrderModel.amount = amount;
    this.SignBuyerOrderModel.blockchainId = this.items.listing.blockchainId;
    this.SignBuyerOrderModel.nftTokenID = this.items.listing.nftTokenID;
    this.SignBuyerOrderModel.supply = 1;
    this.SignBuyerOrderModel.nftAddress = this.items.listing.nftAddress;
    this.SignBuyerOrderModel.isMultiple = this.items.listing.isMultiple;
    this.SignBuyerOrderModel.ownerAddress = this.items.listing.ownerAddress;
    this.SignBuyerOrderModel.royalties =
      this.items.listing.royalties == 0 || this.items.listing.royalties == null
        ? this.items.data.royalties ?? 0
        : this.items.listing.royalties;
    // this.SignBuyerOrderModel.royaltiesOwner = this.items.listing.royaltiesOwner ?? "0x0000000000000000000000000000000000000000";
    this.SignBuyerOrderModel.contractAddress = this.tokenAddress;
    // this.SignBuyerOrderModel.referalAddress =  this.items.listing.referalAddress ?? "0x0000000000000000000000000000000000000000";
    if (this.items.listing.btnType == 'offer') {
      this.SignBuyerOrderModel.ownerAddress =
        '0x0000000000000000000000000000000000000000';
      this.SignBuyerOrderModel.referalAddress =
        '0x0000000000000000000000000000000000000000';
    } else {
      this.SignBuyerOrderModel.referalAddress =
        this.items.listing.referalAddress ??
        '0x0000000000000000000000000000000000000000';
    }
    this.SignBuyerOrderModel.royaltiesOwner =
      this.items.listing.royaltiesOwner ??
      this.items.data.royaltiesOwner ??
      '0x0000000000000000000000000000000000000000';

      debugger;
    // new method
    var signature: any = await this.contractService.signBuyOrder(
      this.SignBuyerOrderModel
    );
    ;
    if (signature.status) {
      this.btnText = 'Submitting data';
      if (this.items.listing.btnType != 'offer') {
        this.nftInteractionService
          .placeBid({
            nftId: this.items.listing.nftTokenID,
            price: amount,
            walletAddress: this.contractService.userAddress,
            signature: signature.signature,
            currency: 1,
            quantity: 1,
            supply: 1,
            listingId: this.items.listing.listingId.toString(),
            salt: salt,
            nftAddress: this.items.listing.nftAddress,
            blockchainId:this.items.listing.blockchainId,
            tokenAddress: this.tokenAddress,
            isMultiple: this.items.listing.isMultiple,
            asset:this.items.listing.asset
          })
          .subscribe((response: any) => {
            ;
            if (response.isSuccess) {
              this.btnText = 'Done';
              this.closeDialog();
            } else {
              this.btnText = 'Place Bid';
            }
            this.nftInteractionService.showToastr(
              response.message,
              response.status
            );
          });
      } else {
        let url = 'api/placeBidAll';
        let body = {
          nftId: this.items.listing.nftTokenID,
          price: amount,
          walletAddress: this.contractService.userAddress,
          signature: signature.signature,
          currency: 1,
          quantity: 1,
          supply: 1,
          listingId: this.items.listing.listingId.toString(),
          salt: salt,
          nftAddress: this.items.listing.nftAddress,
          tokenAddress: this.tokenAddress,
          isMultiple: this.items.listing.isMultiple,
          blockchainId:this.items.listing.blockchainId,
          asset:this.items.listing.asset,
        };
        this.collectionApiService.postRequest(body, url).subscribe(
          (res: any) => {
            if (res.status == 200) {
              this.btnText = 'Done';
              this.nftInteractionService.showToastr(res.message, res.status);
              this.closeDialog();
            } else {
              this.btnText = 'Place Bid';
              this.nftInteractionService.showToastr(res.message, false);
              this.btnText = 'Place Bid';
              this.invalidValue = false;
            }
          },
          (err: any) => {
            this.btnText = 'Place Bid';
            this.invalidValue = false;
          }
        );
      }
    } else {
      this.btnText = 'Place Bid';
    }
  }
}
