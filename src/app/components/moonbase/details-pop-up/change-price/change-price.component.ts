import { Component, OnInit,Inject } from '@angular/core';
import {FormsModule,ReactiveFormsModule,FormControl,Validators,FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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


    var status:any= await this.contractService.signSellOrder(
      this.data.ID,
      data.newPrice,
      this.data.currentSupply,
      this.data.nftAddress,
      this.data.isMultiple,
      salt,
      userDate?.userInfo.referralAddress,
      this.data.royalties,
      this.data.royaltiesOwner,
      );
    
    if(status.status){
    data.nftId = this.data.ID;
    data.walletAddress = this.Address;
    data.signature = status.signature;
    data.nftAddress = this.data.nftAddress;
    data.supply = this.data.currentSupply;
     data.salt = salt;
    data.isMultiple = this.data.isMultiple;
    
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

        this.dialogRef.close();
      }
      else
      {
        this.isSuccess = result.isSuccess;
        this.errorMsg = result.message;
        this.isApiLoading = false;
        this.toastrService.success(result.message);
        
      }
    
    })
  }
  }

  close(): void {
    this.dialogRef.close();
  }

}
