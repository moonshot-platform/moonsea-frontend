import { Component, OnInit, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { PlaceBidModalComponent } from '../place-bid-modal/place-bid-modal.component';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { exchangeToken } from 'src/app/model/signBuyerOrder';

@Component({
  selector: 'app-purchase-now-modal',
  templateUrl: './purchase-now-modal.component.html',
  styleUrls: ['./purchase-now-modal.component.scss']
})
export class PurchaseNowModalComponent implements OnInit {

  balanceInBNB: Number = 0;
  price: any = 0;
  step: Number = 1;
  serviceFees = 0;
  total = "0";
  signaturePrice = 0;
  txnConfirmation: string = "Sending transaction with your wallet";
  txnData: any;
  quantity: any;
  priceCalculated: any = 0;
  serviceFeesPer: number = 2.5;
  wrongNetwork: boolean = false;
  shareUrl = location.origin + '/details/' + this.items.nftTokenID;


   exchangeTokenObj:exchangeToken =  new exchangeToken();
   isBouthSuccessfully:boolean;


  constructor(private contractService: ContractService, @Inject(MAT_DIALOG_DATA) public items: any,
    private toastr: ToastrService, private nftInteractionService: NftInteractionService,
    private dialogRef: MatDialogRef<PlaceBidModalComponent>, private pricingDetails: PricingApiService
  ) {
    this.serviceFeesPer = pricingDetails.serviceFees;
  }

  ngOnInit(): void {
    this.checkNetwork();
  }

  async checkNetwork() {
    debugger
    let checkNetwork: boolean = await this.contractService.createContract(this.items.blockchainId);
    if (!checkNetwork) {
      this.wrongNetwork = true;
      this.step = 0;
    }
    else {
      this.wrongNetwork = false;
      this.step = 1;
      this.calculatePrice();
    }
  }
  async calculatePrice() {


    if (this.items.typeOfSale == 1) {

      this.price = this.items.price;
    }
    else if (this.items.typeOfSale == 2) {
      this.price = this.items.minimunBid;
    }
    else {
      this.price = 0;
    }
    this.signaturePrice = this.price;
    this.priceCalculated = (Number(this.price) / Number(this.items.supply)).toFixed(8)
    this.serviceFees = Number(((this.serviceFeesPer * this.priceCalculated) / 100).toFixed(8));
    this.total = (Number(this.serviceFees) + Number(this.price)).toFixed(8);

    var balance = 0;

    balance = await this.contractService.getBalance();
    this.balanceInBNB = balance > 0 ? Number((balance / 1e18).toFixed(8)) : 0;
  }

  gotoNextStep(temp: number, quantity: any) {
    debugger
    if (temp == 2) {
      if (this.items.supply < quantity) {
        return false;
      }
      if (this.balanceInBNB >= this.price) {
        this.step = temp;
        this.quantity = quantity;
        this.exchangeToken();
      }
      else {
        this.toastr.error("Insufficient balance")
      }
    }
    return true;


  }

  calculatePriceQuantity(quantity: any) {
    if (quantity > this.items.supply) {

      return false;
    }
    this.priceCalculated = ((Number(this.price) / Number(this.items.supply)) * quantity).toFixed(8)
    this.serviceFees = Number(((this.serviceFeesPer * this.priceCalculated) / 100).toFixed(8));
    this.total = (Number(this.serviceFees) + Number(this.price)).toFixed(8);
    return false;
  }


  async exchangeToken() {

    this.exchangeTokenObj.nftTokenID =  this.items.nftTokenID;
    this.exchangeTokenObj.supply =  this.items.supply;
    this.exchangeTokenObj.nftAddress =   this.items.nftAddress;
    this.exchangeTokenObj.signature =   this.items.signature;
    this.exchangeTokenObj.ownerAddress = this.items.ownerAddress;
    this.exchangeTokenObj.isMultiple = this.items.isMultiple;
    this.exchangeTokenObj.total = this.total;
    this.exchangeTokenObj.signaturePrice = this.signaturePrice;
    this.exchangeTokenObj.quantity = this.quantity;
    this.exchangeTokenObj.tokenAddress = "0x0000000000000000000000000000000000000000"
    this.exchangeTokenObj.royalties = this.items.royalties;
    this.exchangeTokenObj.royaltiesOwner = this.items.royaltiesOwner;
    this.exchangeTokenObj.buyerSignature = '-1' 
    this.exchangeTokenObj.salt = this.items.salt;
    this.exchangeTokenObj.referalAddress = this.items.referalAddress;
    
    debugger
    var status: any = await this.contractService.exchangeToken01(this.exchangeTokenObj,this.items.blockchainId);

    if (status.status) {
      this.txnConfirmation = "Waiting for transaction confirmation";
      let data = await status.hash.wait(20);
      this.step = 3;
      this.txnData = status.hash.hash;
      this.toastr.success("Bought successfully");
      this.isBouthSuccessfully = true;
     
    }
    else {
      this.isBouthSuccessfully = false;
      this.step = 1;
    }
  }

  closeDialog() {
    this.dialogRef.close();
    if(this.isBouthSuccessfully){
      location.reload();
    }
   
  }
  gotoTestNetBscScan(txnHash: any) {
    let url = environment.bscTestnetScan + txnHash;
    window.open(url, "_blank");
  }
}
