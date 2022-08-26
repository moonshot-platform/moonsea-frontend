import { Component, OnInit,Inject } from '@angular/core';
import {FormsModule,ReactiveFormsModule,FormControl,Validators,FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SignSellOrder01 } from 'src/app/model/signBuyerOrder';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';


@Component({
  selector: 'app-change-price',
  templateUrl: './change-price.component.html',
  styleUrls: ['./change-price.component.scss']
})
export class ChangePriceComponent implements OnInit {

  
  Address: any;
  isSubmitted: any;
  isSuccess: any;
  errorMsg: any;
  currentPrice: any;
  isApiLoading: any;
  wrongNetwork: boolean=true;
  isChangePriceMessage:boolean= false;

  constructor(public dialogRef: MatDialogRef<ChangePriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService : GetDataService,
    private toastrService:ToastrService,
    private contractService:ContractService) { }

  ngOnInit(): void {
    this.isApiLoading = false;
    this.Address =  localStorage.getItem('address');
    this.currentPrice = this.data.currentPrice;
    this.updatePriceform.controls['newPrice'].setValue(this.data.currentPrice);
    this.checkNetwork();
  }

  

async checkNetwork()
{
  let checkNetwork : boolean = await this.contractService.createContract(this.data.blockchainId);
  if(!checkNetwork)
  {  
    this.wrongNetwork = true;
  }
  else
  {
    this.wrongNetwork = false;
   }
}

  get formControls() { return this.updatePriceform.controls; }

  updatePriceform = new FormGroup(
    {

      newPrice : new FormControl('',Validators.required)
    }
  )


  async updatePriceSave(data:any)
  {
    this.isApiLoading = true;
    this.isSubmitted = true;
    let salt = this.contractService.randomNo();
    var userDate= JSON.parse(localStorage.getItem("userData") ?? "{}");


    
    if(!userDate){
      this.contractService.isRegisterd.next("not register");
      return;
    }
    let sig :SignSellOrder01;
    sig={
      nftId: this.data.ID,
      price:  data.newPrice,
      supply: this.data.currentSupply,
      nftAddress:  this.data.nftAddress,
      isMultiple: this.data.isMultiple,
      salt: salt,
      referralAddress:  userDate?.referralAddress,
      royalties:  this.data.royalties,
      royaltiesOwner: this.data.royaltiesOwner??'0x0000000000000000000000000000000000000000',
      tokenAddress:  '0x0000000000000000000000000000000000000000',
      blockchainId:this.data.blockchainId
    }

    var status:any= await this.contractService.signSellOrder(
      sig
      );
    //debugger;
    if(status.status){
    data.nftId = this.data.ID;
    data.walletAddress = this.Address;
    data.signature = status.signature;
    data.nftAddress = this.data.nftAddress;
    data.supply = this.data.currentSupply;
     data.salt = salt;
    data.isMultiple = this.data.isMultiple;
    data.blockchainId = this.data.blockchainId;
    data.asset = this.data.asset;
    
    this.getDataService.updatePriceSave(
      data
    ).subscribe((result:any)=>
    {

      if(!result.isSuccess)
      {
        this.isSuccess = result.isSuccess;
        this.errorMsg = result.message;
        this.isApiLoading = false;
        this.toastrService.success(result.message);
        this.isChangePriceMessage = false;
        this.dialogRef.close();
      }
      else
      {
        this.isSuccess = result.isSuccess;
        this.errorMsg = result.message;
        this.isApiLoading = false;
        this.toastrService.success(result.message);
        this.isChangePriceMessage = true;
        
      }
    
    })
  }else{
    this.isChangePriceMessage = false;
    this.isApiLoading = false;
  }
  }

  close(): void {
    this.dialogRef.close();
    window.location.reload();
  }

}
