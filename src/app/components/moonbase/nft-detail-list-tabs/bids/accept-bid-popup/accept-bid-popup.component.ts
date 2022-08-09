import { Component, OnInit, Inject, Input } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { environment } from 'src/environments/environment';
import { exchangeToken, SignSellOrder } from 'src/app/model/signBuyerOrder';
import blockjson from '../../../../../../assets/blockchainjson/blockchain.json';
import config from '../../../../../../assets/configFiles/tokenAddress.json';
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
  isApiLoading:boolean=false;

  exchangeTokenObj:exchangeToken =  new exchangeToken();
  signSellOrder : SignSellOrder = new SignSellOrder();
  blockchainInfo:any ={};
  contractAddress:any='';
  chainId:any;
  constructor(
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public items: any,
    private toastr: ToastrService,
    private nftInteractionService: NftInteractionService,
    private dialogRef: MatDialogRef<AcceptBidPopupComponent>,
    public pricingDetails: PricingApiService
  ) {
    this.serviceFees = pricingDetails.serviceFees;
  }

  ngOnInit(): void {
    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.items.nftDetails.blockchainId){
        this.blockchainInfo = element;
      }
    });
    
    this.getNftDetails();
    this.checkNetwork();
    this.pricingDetails.getServiceFee();
   
    this.contractAddress  = this.contractService.getAddressWeth(
      this.items.nftDetails.blockchainId
    );
    
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
    this.isApiLoading = true;
    var balance = await this.contractService.getBalance();
    this.balanceInBNB = balance > 0 ? Number((balance / 1e18).toFixed(4)) : 0;

    this.nftInteractionService
    .getNftDetails(this.contractService.userAddress, this.items?.nftDetails?.asset)
    .subscribe((response: any) => {
      if (response.isSuccess) {
        
        this.nftDetails = response.data;
        this.shareUrl = location.origin+'/details/'+this.nftDetails.nftId;
        this.signaturePrice = this.items.data.price;
        this.price = (
          Number(this.signaturePrice) / 1// Number( this.nftDetails.supply)
        ).toFixed(4);
        this.serviceFees = (this.nftDetails.serviceFee * this.price) / 100;
        this.total = (Number(this.price) - Number(this.serviceFees)).toFixed(
          4
        );
        this.isApiLoading = false;
      }else{
        this.isApiLoading = false;
      }
    },(err:any)=>{
      this.isApiLoading = false;
    });

   
  }

  nextStep() {
    // if(this.total == '0'){
    //   return;
    // }
    this.step = 1;
  }
  gotoNextStep(temp: number) {
    
    this.exchangeToken();
  }

  async exchangeToken() {
    //debugger
    
    let salt = this.items.data.salt;
    this.signSellOrder.nftId =  this.items.nftId,
    this.signSellOrder.price =   this.items.data.price,
    this.signSellOrder.quantity =  this.items.data.quantity,
    this.signSellOrder.nftAddress =   this.items.nftDetails.nftAddress,
    this.signSellOrder.isMultiple = this.items.nftDetails.isMultiple,
    this.signSellOrder.salt = salt
    this.signSellOrder.royalties =  this.items.nftDetails.royalties,
    this.signSellOrder.royaltiesOwner = this.items.nftDetails.royaltiesOwner,
    // this.signSellOrder.contractAddress =  this.items.nftDetails.contractAddress,
    this.signSellOrder.contractAddress =  this.contractAddress,
    this.signSellOrder.referralAddress =  this.items.data.referralAddress
    this.signSellOrder.blockchainId = this.items.nftDetails.blockchainId


//debugger
    let sign = await this.contractService.signSellOrder01(
      this.signSellOrder
    );
   
    this.exchangeTokenObj.nftTokenID =   this.nftDetails.nftId;
    this.exchangeTokenObj.supply = 1;// this.items.data.isShowAcceptButtonForAll ? 1 : this.items.data.supply;
    this.exchangeTokenObj.nftAddress =   this.items.nftDetails.nftAddress;
    this.exchangeTokenObj.signature =   sign.signature;
    this.exchangeTokenObj.ownerAddress = this.contractService.userAddress;
    this.exchangeTokenObj.isMultiple = this.items.nftDetails.isMultiple;
    this.exchangeTokenObj.total = this.total;
    this.exchangeTokenObj.signaturePrice = this.signaturePrice;
    this.exchangeTokenObj.quantity = this.items.data.quantity,
    this.exchangeTokenObj.tokenAddress =  this.contractAddress,
    this.exchangeTokenObj.royalties = this.items.nftDetails.royalties;
    this.exchangeTokenObj.royaltiesOwner =this.items.nftDetails.royaltiesOwner;
    this.exchangeTokenObj.buyerSignature = this.items.data.signature;
    this.exchangeTokenObj.salt = salt;
    this.exchangeTokenObj.referalAddress =   this.items.data.referralAddress;
    this.exchangeTokenObj.buyer = this.items.data.walletAddress;
    this.exchangeTokenObj.isMakeOffer = this.items.data.isMakeOffer;
//debugger
    var a:any =await this.contractService.isApprovedForAll(this.exchangeTokenObj.isMultiple,this.items.nftDetails.blockchainId,this.items.nftDetails.nftAddress);
    if(a.status==true && a.hash==false){
      let tx:any = await this.contractService.setApprovalForAll(this.exchangeTokenObj.isMultiple,this.items.nftDetails.blockchainId,this.items.nftDetails.nftAddress);
      await tx.hash.wait(1);
    }
    
      //debugger
    var status: any = await this.contractService.exchangeToken01(
      this.exchangeTokenObj,
      this.items.nftDetails.blockchainId);
//debugger
    if (status.status) {
      this.step = 2;
      await status.hash.wait(5);
      this.txnHash = status.hash.hash;
      this.step = 3;
      this.toastr.success('Bought successfully');
    }
  }

  close() {
    this.dialogRef.close();
    location.reload();
  }
  
  closePopup(){
    this.dialogRef.close();
    location.reload();
  }

  gotoTestNetBscScan(txnHash :any){
    //purchase now modal component madhe ahe 
    let url =`${this.blockchainInfo.exploreUrl}tx/${txnHash}`;
    // let url =environment.bscTestnetScan+txnHash;
    window.open(url, "_blank");
  }
  
}
