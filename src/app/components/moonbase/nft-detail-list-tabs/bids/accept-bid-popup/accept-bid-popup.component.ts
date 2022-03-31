import { Component, OnInit, Inject, Input } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accept-bid-popup',
  templateUrl: './accept-bid-popup.component.html',
  styleUrls: ['./accept-bid-popup.component.scss'],
})
export class AcceptBidPopupComponent implements OnInit {
  balanceInBNB: Number = 0;
  price: any = 0;
  step: Number = 1;
  serviceFees = 0;
  total = '0';
  signaturePrice = 0;
  nftDetails: any;
  wrongNetwork: boolean = false;
  shareUrl = "";
  txnHash: any;
  constructor(
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    private toastr: ToastrService,
    private nftInteractionService: NftInteractionService,
    private dialogRef: MatDialogRef<AcceptBidPopupComponent>,
    private pricingDetails: PricingApiService
  ) {
    this.serviceFees = pricingDetails.serviceFees;
  }

  ngOnInit(): void {
    console.log(this.items);
    
    this.getNftDetails();
    this.checkNetwork();
  }

  async checkNetwork() {
    let checkNetwork: boolean = await this.contractService.createContract(this.items.nftDetails.blockchainId);
    if (!checkNetwork) {
      this.wrongNetwork = true;
      this.step = 0;
    } else {
      this.wrongNetwork = false;
      this.step = 4;
    }
  }

  async getNftDetails() {
    var balance = await this.contractService.getBalance();
    this.balanceInBNB = balance > 0 ? Number((balance / 1e18).toFixed(4)) : 0;
    this.nftInteractionService
      .getNftDetails(this.contractService.userAddress, this.items.nftId)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          this.nftDetails = response.data;
          this.shareUrl = location.origin+'/details/'+this.nftDetails.nftId;
          this.signaturePrice = this.items.data.price;
          this.price = (
            Number(this.signaturePrice) / Number(this.nftDetails.supply)
          ).toFixed(4);
          this.serviceFees = (this.nftDetails.serviceFee * this.price) / 100;
          this.total = (Number(this.price) - Number(this.serviceFees)).toFixed(
            4
          );
        }
      });
  }

  nextStep() {
    this.step = 1;
  }
  gotoNextStep(temp: number) {
    this.exchangeToken();
  }

  async exchangeToken() {

 
    let salt = this.items.data.salt;
   
    let sign = await this.contractService.signSellOrder01(
      this.nftDetails.nftId,
      this.items.data.price,
      this.items.data.quantity,
      this.nftDetails.nftAddress,
      this.nftDetails.isMultiple,
      salt,
      this.items.nftDetails.royalties,
      this.items.nftDetails.royaltiesOwner,
      this.items.nftDetails.contractAddress,
      this.items.data.referralAddress
    );
   
    

    var status: any = await this.contractService.exchangeToken01(
      this.nftDetails.nftId,
      this.items.data.quantity,
        this.nftDetails.nftAddress,
         sign.signature,
          this.contractService.userAddress,
          this.nftDetails.isMultiple,
          this.total,
          this.signaturePrice,
          1,
          this.items.nftDetails.contractAddress,
          this.items.nftDetails.royalties,
          this.items.nftDetails.royaltiesOwner,
          this.items.data.signature,
          salt,
          this.items.data.referralAddress,
          this.items.data.walletAddress
    );
    // console.log(status);

    if (status.status) {
      await status.hash.wait(5);
      this.txnHash = status.hash.hash;
      this.step = 3;
      this.toastr.success('Bought successfully...');
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  gotoTestNetBscScan(txnHash :any){
    let url =environment.bscTestnetScan+txnHash;
    window.open(url, "_blank");
  }
}
