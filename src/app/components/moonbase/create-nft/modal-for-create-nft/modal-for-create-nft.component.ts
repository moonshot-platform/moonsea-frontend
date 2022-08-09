import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SignSellOrder01 } from 'src/app/model/signBuyerOrder';
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
  isApiLoading: boolean = false;
  startSaleButton: any = "Approve";
  signSellorderButton: any = 'Sign';

  mintingSteps:any = 1;

  constructor(
    public dialogRef: MatDialogRef<ModalForCreateNftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createNFTService: CreateNftService,
    private getDataService: GetDataService,
    private contractService: ContractService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.checkNetwork();
    this.contractService.getWalletObs().subscribe((data: any) => {
      this.isConnected = this.contractService.checkValidAddress(data);
      if (this.isConnected) {
        this.connectedAddress = data;
        this.getUserBalance();
      }
      // this.dialogRef.close();
    });
  }
  async getUserBalance() {
    this.netWorkId = await this.contractService.getConnectedNetworkId();
    this.userBalance = await this.contractService.getBalance();
  }

  async checkNetwork() {
  
    let checkNetwork: boolean = await this.data.globalService.createContract(
      this.data.details.blockchainId
    );
    //debugger
    if (!checkNetwork) {
      this.wrongNetwork = true;
      this.mintStatusText = 'Try Again';
      let chainIdd = this.data.globalService.chainId;
     
      let switchNetwork = this.contractService.switchNetwork(chainIdd);
      switchNetwork.then(
        (res: any) => {
          if (res == 'doneeeeee') {
            this.wrongNetwork = false;
            this.mintStatusText = 'Submit';

          }
        },
        (err: any) => {
          this.wrongNetwork = true;
        }
      ).catch((err:any)=>{
        console.log(err);
        
      })

    } else {
      this.wrongNetwork = false;
      this.initiateTransaction();
    }
  }
  async initiateTransaction() {
    //debugger
    try {
      var status: any;
      this.mintStatusText = 'Waiting for confirmation';

      if (this.data.details.isMultiple == false) {
        //debugger
        status = await this.data.globalService.mintTokenErc721(
          this.data.details.nftTokenID,
          this.data.details.nftAddress
        );
      } else {
        status = await this.data.globalService.mintTokenErc1155(
          this.data.details.nftTokenID,
          this.data.details.numberOfCopies,
          this.data.details.nftAddress
        );
      }
      //debugger
      if (status?.status) {
        this.isApiLoading = true;
        await status.hash.wait(2);
        this.data.details.transactionHash = status.hash.hash;
        this.isdisabledDoneBtn = true;

        let url = 'api/UpdateNftToken';
        this.getDataService.postRequest(url, this.data.details).subscribe(
          async (res: any) => {

            if (res.status == 200) {

              this.royaltiesDetails = res.data;
              this.isApiLoading = true;
              await this.delay(60000);
              this.mintingSteps = 2;
              this.isApiLoading = false;
              this.mintStatusText = 'Done';
              this.rejectedMetamask = false;
              this.getDataService.showToastr(res.message, res.isSuccess);

              if (!this.data.details.putOnSale) {
                this.dialogRef.close();
              }
              if (this.data.details.putOnSale) {
                this.signatureStatus = 1;
              } else {
                this.signatureStatus = 4;
                this.isCompleted = true;
              }
            } else {
              this.mintStatusText = 'Try Again';
              this.isdisabledDoneBtn = false;
              this.getDataService.showToastr(res.message, res.isSuccess);
            }
          },
          (err: any) => {
            this.getDataService.showToastr(err, false);
          }
        );
      } else {
        this.rejectedMetamask = true;
        this.mintStatusText = 'Try Again';
        this.isdisabledDoneBtn = false;
        this.getDataService.showToastr('Something went wrong, please try again.', false);
      }
    } catch (e) {
      console.log(e);
      //debugger
      this.rejectedMetamask = true;
      this.mintStatusText = 'Try Again';
      this.isApiLoading = false;
      this.getDataService.showToastr('cannot estimate gas; transaction may fail or may require manual gas limit or may token already minted.', false);
    }
  }

  async startSale() {
    let status: any;
    //debugger

    status = await this.data.globalService.isApprovedForAll(
      this.data.details.isMultiple,
      this.data.details.blockchainId,
      this.data.details.nftAddress
    );

    if (status.status == false) {
      status = await this.data.globalService.setApprovalForAll(
        this.data.details.isMultiple,
        this.data.details.blockchainId,
        this.data.details.nftAddress
      );
      if (status) {
        this.approvalTransactionHash = status.hash.hash;
      }

    }
//debugger
    if (status.status) {
   
      this.startSaleButton = 'Done';
      this.signatureStatus = 2;
      this.mintingSteps = 3;
      this.getDataService.showToastr('Start sell done.', true);

    } else {
      this.rejectedMetamask = true;
    }
  }

  async signSellOrder() {
    //debugger
    try {
      var status: any;
      let salt = this.data.globalService.randomNo();
      if (this.data.details.typeOfSale == 1) {
        var userDate = JSON.parse(localStorage.getItem('userData') ?? '{}');

        if (!userDate) {
          this.contractService.isRegisterd.next("not register");
          return;
        }
        
        let sellOrder:SignSellOrder01 ={
          nftId:  this.data.details.nftTokenID,
          price:  this.data.details.minimunBid,
          supply: this.data.details.numberOfCopies,
          nftAddress: this.data.details.isMultiple == false
          ? this.data.globalService.nft721Address
          : this.data.globalService.nft1155Address,
          isMultiple:  this.data.details.isMultiple,
          salt: salt,
          referralAddress: userDate?.referralAddress,
          royalties: this.royaltiesDetails.royalties,
          royaltiesOwner: this.royaltiesDetails.royaltiesOwner?? '0x0000000000000000000000000000000000000000',
          tokenAddress:  '0x0000000000000000000000000000000000000000',
          blockchainId: this.data.details.blockchainId
        }

        status = await this.data.globalService.signSellOrder(
          sellOrder
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
      //debugger
      if (status.status) {
        this.signatureStatus = 3;
        this.isApiLoading = true;
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
              this.data.details.isMultiple == false
                ? this.data.globalService.nft721Address
                : this.data.globalService.nft1155Address,
            asset: this.data.details.asset,
          })
          .subscribe((response: any) => {
            this.getDataService.showToastr(
              response.message,
              response.isSuccess
            );
            this.isApiLoading = false;
            this.signSellorderButton = 'Done';
            this.isCompleted = true;
          });
      } else {
        // this.rejectedMetamask = true;
        this.isApiLoading = false;
        this.getDataService.showToastr('Something went wrong, please try again.', false);
      }
    } catch (e) {
      // this.rejectedMetamask = true;
      this.isApiLoading = false;
      this.getDataService.showToastr('Something went wrong, please try again.', false);
    }
  }


  closeTheModal(){
    this.dialogRef.close();
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

  delay(ms: any) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }
}
