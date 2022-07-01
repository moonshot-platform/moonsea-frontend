import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-burn-token',
  templateUrl: './burn-token.component.html',
  styleUrls: ['./burn-token.component.scss']
})
export class BurnTokenComponent implements OnInit {
  Address: any;
  errorMsg: any;
  data1: any;
  isApiLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<BurnTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService : GetDataService,
    private contractService:ContractService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.Address =  localStorage.getItem('address');
    
  }
  close(): void {
    this.dialogRef.close();
  }

  async burnSave(quanity:any)
  {
    if(quanity<=0)
    {
      quanity = 1;
    }
    this.isApiLoading = true;
    // this.data1.nftId = this.data.ID;
    // this.data1.walletAddress = this.Address;
    var status:any;
    if(this.data.isMultiple)
    {
      status = await this.contractService.burnMultiple(this.data.ID,quanity);
    }else{
     status = await this.contractService.burnSignle(this.data.ID);
    }

    if(status.status){
      await status.hash.wait(3);
      this.toastrService.success("Burned succesfully");
    
    
    }
  
  }

}
