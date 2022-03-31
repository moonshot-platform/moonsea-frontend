import { Component, OnInit,Inject } from '@angular/core';
import {FormsModule,ReactiveFormsModule,FormControl,Validators,FormGroup} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transfer-token',
  templateUrl: './transfer-token.component.html',
  styleUrls: ['./transfer-token.component.scss']
})
export class TransferTokenComponent implements OnInit {

  isSubmitted: boolean = false;
  Address: any;
  nftId: any;
  isSuccess: any;
  errorMsg: any;
  currentSupply: any;
  isApiLoading: boolean=false;
  nftAddress: any;
  constructor(public dialogRef: MatDialogRef<TransferTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private getDataService : GetDataService,
    private toastrService:ToastrService,
    private contractService:ContractService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.Address =  localStorage.getItem('address');
    this.nftId = this.data.ID;
    this.currentSupply = this.data.currentSupply;

    this._activatedRoute.params.subscribe(
      params =>{
      this.nftAddress = params['nftAddress'];
      }
      );
  }
  close(): void {
    this.dialogRef.close();
  }
  
  get formControls() { return this.transferform.controls; }

  transferform = new FormGroup(
    {
      toWalletAddress : new FormControl('',Validators.required),
      quantity : new FormControl('',[Validators.required,Validators.max(5)]), 
    }
  )

  async transferSave(data:any)
  {
    this.isApiLoading = true;
    this.isSubmitted = true;
   
    data.nftId = this.data.ID;
    data.fromWalletAddress = this.Address;

    var status:any;
    if(this.data.isMultiple)
    {
      debugger
      status = await this.contractService.transferTokenMultiple(data.toWalletAddress,this.data.ID,data.quantity,this.data.nftAddress);
    }else{
      debugger
     status = await this.contractService.transferTokenSingle(data.toWalletAddress,this.data.ID,this.data.nftAddress);
    }
    
    if(status.status){
      await status.hash.wait(3);
      this.toastrService.success("Transferred succesfully...");
  }
  }

}
