import { Component, OnInit, Input, Inject } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ethers } from 'ethers';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-place-bid-modal',
  templateUrl: './place-bid-modal.component.html',
  styleUrls: ['./place-bid-modal.component.scss']
})
export class PlaceBidModalComponent implements OnInit {
  
  balanceInBNB: string = "";
  price: any;
  invalidValue = true;
  btnText = "Place bid";
  serviceFees: number = 0;
  total: string = "0";
  serviceFeesVal: number = 0;
  wrongNetwork: boolean = false;
  step = 0;
  balanceDetailsToken!: { balance: any; status: boolean; decimals: any };

  constructor(
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    private dialogRef: MatDialogRef<PlaceBidModalComponent>,
    private nftInteractionService: NftInteractionService,
    private pricingDetails: PricingApiService,
    private toastr: ToastrService
  ) {
    this.serviceFeesVal = pricingDetails.serviceFees;
  }

  ngOnInit(): void {
    console.warn(this.items);
    this.getAccount();
    this.checkNetwork();
  }

  async checkNetwork() {
    let checkNetwork: boolean = await this.contractService.createContract(
      this.items.blockchainId
    );
    if (!checkNetwork) {
      this.wrongNetwork = true;
      this.step = 0;
    } else {
      this.wrongNetwork = false;
      this.step = 1;
    }
  }

  async getAccount() {
    debugger;
    this.balanceDetailsToken = await this.contractService.getTokenBalance(
      this.items.contractAddress
    );
    debugger;
    this.balanceInBNB =
      this.balanceDetailsToken.balance > 0
        ? (
            this.balanceDetailsToken.balance /
            10 ** this.balanceDetailsToken.decimals
          ).toFixed(4)
        : "0";
    this.price = this.items.price / this.items.supply;
    this.invalidValue = false;

    console.log(this.balanceInBNB);
    
  }

  closeDialog() {
    this.dialogRef.close();
  }

  validatePrice(event: any) {
    if (this.price > event.target.value) {
      this.invalidValue = true;
    } else {
      this.invalidValue = false;
    }
  }

  checkBalance(amount: any) {
    console.log("check");
    if (
      this.balanceDetailsToken.balance >=
      amount * 10 ** this.balanceDetailsToken.decimals
    ) {
      return true;
    } else {
      this.toastr.error("Insufficient balance");
      return false;
    }
    return false;
  }

  async approveToken(amount: any) {
    if (this.checkBalance(amount)) {
      try {
        let allowance: any = await this.contractService.checkAllowance(
          this.items.contractAddress,
          amount
        );
        if (allowance.status && allowance.allowance) {
          this.PlaceBid(amount);
        } else if (allowance.status && !allowance.allowance) {
          this.btnText = "Approve Token...";
        
          let allowToken: any = await this.contractService.approveToken(
            amount,
            this.items.contractAddress
          );
         
          if (allowToken.status) {
            allowToken.hash.wait(3);
            this.btnText = "Waiting for tokenApproval...";
            this.PlaceBid(amount);
          }
        }
      } catch (e) {
        this.btnText = "Place bid";
      }
    }
  }

  async PlaceBid(amount: any) {
    debugger;
    let salt = this.contractService.randomNo();
    // const params2 = ethers.utils.parseEther(amount.toString());
    this.btnText = "Waiting for signature";
    var signature: any = await this.contractService.signBuyOrder(
      this.items.nftTokenID,
      amount,
      1,
      this.items.nftAddress,
      this.items.isMultiple,
      this.items.ownerAddress,
      this.items.royalties,
      this.items.royaltiesOwner,
      salt,
      this.items.contractAddress,
      this.items.referalAddress
    );
      debugger
    if (signature.status) {
      this.btnText = "Submitting data...";
      this.nftInteractionService
        .placeBid({
          nftId: this.items.nftTokenID,
          price: amount,
          walletAddress: this.contractService.userAddress,
          signature: signature.signature,
          currency: 1,
          quantity: 1,
          supply:1,
          listingId: this.items.listingId.toString(),
          salt: salt,
          nftAddress : this.items.nftAddress,
          tokenAddress : this.items.contractAddress
        })
        .subscribe((response: any) => {
          if (response.isSuccess) {
            this.btnText = "Done";
            this.closeDialog();
          } else {
            this.btnText = "Place Bid";
          }
          this.nftInteractionService.showToastr(
            response.message,
            response.status
          );
        });
    } else {
      this.btnText = "Place Bid";
    }
  }
}
