import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { removefromsale } from 'src/app/model/signBuyerOrder';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-remove-from-sale',
  templateUrl: './remove-from-sale.component.html',
  styleUrls: ['./remove-from-sale.component.scss']
})
export class RemoveFromSaleComponent implements OnInit {
  Address: any;
  data1: any;
  errorMsg: any;
  isApiLoading: any;
  isDisableCancelbutton:boolean=false;
  isRemovedSteps:number=1;
  constructor(public dialogRef: MatDialogRef<RemoveFromSaleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService : GetDataService,
    private contractService:ContractService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.isApiLoading = false;
    this.Address =  localStorage.getItem('address');
  }
  
  close(): void {
    this.dialogRef.close();
    window.location.reload();
  }


  async removeSave()
  {
    let removesaleObj :removefromsale={
      nftId:  this.data.nftTokenID,
      price:  this.data.price,
      supply:  this.data.currentSupply,
      nftAddress:  this.data.nftAddress,
      isMultiple: this.data.isMultiple,
      tokenAddress:  this.data.contractAddress,
      royaltiesOwner:   this.data.royaltiesOwner??'0x0000000000000000000000000000000000000000',
      royalties:   this.data.royalties,
      referralAddress: this.data.referalAddress??'0x0000000000000000000000000000000000000000',
      blockchainId:this.data.blockchainId
    }
//  //debugger
    this.isApiLoading = true;
    var status:any= await this.contractService.getOrderData(
      removesaleObj
    );
    // //debugger
    if(status.status){
      
    this.data1= {nftId:this.data.ID,walletAddress:this.Address,signature : status.signature};
    let checkNetwork : boolean = await this.contractService.createContract(1);
    if(checkNetwork)
    {
    
  try {
    var txn:any = await this.contractService.cancelOrder(
      status.orderkey
    );
    // //debugger
    this.isDisableCancelbutton = true;
    await txn.wait(2);
    this.isRemovedSteps = 2;
        this.toastrService.success("Removed successfully.");
        this.isDisableCancelbutton = false;
        this.isApiLoading = false;

  } catch (error) {
    console.log(error);
    this.isDisableCancelbutton = false;
    this.isApiLoading = false;
  }
    }
  }else{
    this.isDisableCancelbutton = false;
    this.isApiLoading = false;
  }
  
  }
}
