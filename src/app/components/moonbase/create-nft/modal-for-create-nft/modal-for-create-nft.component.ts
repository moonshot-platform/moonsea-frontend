import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-modal-for-create-nft',
  templateUrl: './modal-for-create-nft.component.html',
  styleUrls: ['./modal-for-create-nft.component.scss'],
})
export class ModalForCreateNftComponent implements OnInit {
  mintStatusText = '';
  signatureStatus: number = 0;
  rejectedMetamask = false;
  approvalTransactionHash = '';
  wrongNetwork: boolean = false;
  isCompleted: boolean = false;
  royaltiesDetails: any;
  isContractApproved: boolean;
  isConnected = false;
  connectedAddress = '';
  userBalance = 0;
  netWorkId = 0;
  isdisabledDoneBtn: boolean = false;
  isApiLoading :boolean=false;

  constructor(
    public dialogRef: MatDialogRef<ModalForCreateNftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createNFTService: CreateNftService,
    private getDataService: GetDataService,
    private contractService: ContractService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.checkNetwork();
    this.contractService.getWalletObs().subscribe((data: any) => {
      this.isConnected = this.contractService.checkValidAddress(data);
      if (this.isConnected) {
        this.connectedAddress = data;
        this.getUserBalance();
      }
    });
  }
  async getUserBalance() {
    this.netWorkId = await this.contractService.getConnectedNetworkId();
    this.userBalance = await this.contractService.getBalance();
  }

  async checkNetwork() {
    debugger;
    let checkNetwork: boolean = await this.data.globalService.createContract(
      this.data.details.blockchainId
    );
    if (!checkNetwork) {
      this.mintStatusText = 'Try Again...';
      this.wrongNetwork = true;
    } else {
      this.wrongNetwork = false;
      this.initiateTransaction();
    }
  }
  async initiateTransaction() {
    debugger;
    try {
      var status: any;
      this.mintStatusText = 'Waiting for submission';

      if (this.data.typeOfNft == 'single') {
        status = await this.data.globalService.mintTokenErc721(
          this.data.details.nftTokenID,
          this.data.details.royalties
        );
      } else {
        status = await this.data.globalService.mintTokenErc1155(
          this.data.details.nftTokenID,
          this.data.details.royalties,
          this.data.details.numberOfCopies,
          this.data.details.imageUrl
        );
      }
     

      if (status?.status) {
        this.data.details.transactionHash = status.hash;

      

        let url = 'api/UpdateNftToken';
        this.getDataService.postRequest(url, this.data.details).subscribe(
          async (res: any) => {
            console.log(res);
            if (res.status == 200) {
              this.royaltiesDetails = res.data;
              this.isApiLoading = true;
              await this.delay(60000);
              this.isApiLoading = false;
              this.mintStatusText = 'Done';
              this.getDataService.showToastr(res.message, res.isSuccess);
              this.isdisabledDoneBtn = true;
              if(!this.data.details.putOnSale){
                this.dialogRef.close();
              }
              if (this.data.details.putOnSale) {
                this.signatureStatus = 1;
              } else {
                this.signatureStatus = 4;
                this.isCompleted = true;
              }
            } else {
              this.getDataService.showToastr(res.message, res.isSuccess);
            }
          },
          (err: any) => {
            this.getDataService.showToastr(err, false);
          }
        );
      } else {
        this.rejectedMetamask = true;
      }
    } catch (e) {
      this.rejectedMetamask = true;
    }
  }

  async startSale() {
    var status: any;
    status = await this.data.globalService.setApprovalForAll(
      this.data.typeOfNft
    );
    if (status.status) {
      this.approvalTransactionHash = status.hash;
      this.signatureStatus = 2;
    } else {
      this.rejectedMetamask = true;
    }
  }

  async signSellOrder() {
    debugger
    try {
      var status: any;
      let salt = this.data.globalService.randomNo();
      if (this.data.details.typeOfSale == 1) {
        //  salt = this.data.globalService.randomNo();
        var userDate = JSON.parse(localStorage.getItem('userData') ?? '{}');

        status = await this.data.globalService.signSellOrder(
          this.data.details.nftTokenID,
          this.data.details.minimunBid,
          this.data.details.numberOfCopies,
          this.data.typeOfNft == 'single'
            ? this.data.globalService.nft721Address
            : this.data.globalService.nft1155Address,
          this.data.details.isMultiple,
          salt,
          userDate?.userInfo.referralAddress,
          this.royaltiesDetails.royalties,
          this.royaltiesDetails.royaltiesOwner
        );
      } else {
        status = await this.data.globalService.signBidOrder(
          this.data.details.nftTokenID,
          this.data.details.minimunBid,
          this.data.details.numberOfCopies,
          this.data.details.nftAddress,
          this.data.details.isMultiple
        );
      }

      if (status.status) {
        this.signatureStatus = 3;

        this.createNFTService
          .listingUpdateSignature({
            nftId: this.data.details.nftTokenID,
            signature: status.signature,
            currentSupply: this.data.details.numberOfCopies,
            transactionHash: this.approvalTransactionHash,
            price: this.data.details.minimunBid,
            typeOfSale: this.data.details.typeOfSale,
            collectionId: this.data.details.collectionId,
            salt: salt,
            nftAddress:
              this.data.typeOfNft == 'single'
                ? this.data.globalService.nft721Address
                : this.data.globalService.nft1155Address,
          })
          .subscribe((response: any) => {
            this.getDataService.showToastr(
              response.message,
              response.isSuccess
            );
            this.isCompleted = true;
          });
      } else {
        this.rejectedMetamask = true;
      }
    } catch (e) {
      this.rejectedMetamask = true;
    }
  }

  closePopupSignature() {
    if (
      (!this.data.details.isForSale && this.signatureStatus == 1) ||
      this.signatureStatus >= 2
    ) {
      this.dialogRef.close();

      if (!this.rejectedMetamask) {
        // this.router.navigate([
        //   '/profile',
        //   this.connectedAddress,
        //   'tab',
        //   'created',
        // ]);
        // this.createNFTService.subject.next({ tabIndex: 1 });
        // this.router.navigate(['/mycollections']);
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  delay(ms:any){
    return new Promise((resolve,reject)=>{setTimeout(resolve,ms)})
  }
}
