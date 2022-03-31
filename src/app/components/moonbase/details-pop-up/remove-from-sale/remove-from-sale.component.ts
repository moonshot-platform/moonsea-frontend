import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
  }


  async removeSave()
  {
    this.isApiLoading = true;
    var status:any= await this.contractService.getOrderData(
      this.data.nftTokenID,
      this.data.price,
      this.data.currentSupply,
      this.data.nftAddress,
      this.data.isMultiple,
      this.data.contractAddress,
      this.data.royaltiesOwner,
      this.data.royalties,
      this.data.referalAddress
    );
   
    if(status.status){
    this.data1= {nftId:this.data.ID,walletAddress:this.Address,signature : status.signature};
    let checkNetwork : boolean = await this.contractService.createContract(1);
    if(checkNetwork)
    {
    
    var txn:any = await this.contractService.cancelOrder(
      status.orderkey
    );

    await txn.wait(2);

        this.toastrService.success("Done successfully");
        this.isApiLoading = false;

    }
  }
  
  }
}
