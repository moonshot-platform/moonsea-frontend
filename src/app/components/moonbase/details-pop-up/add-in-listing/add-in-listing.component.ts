import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-in-listing',
  templateUrl: './add-in-listing.component.html',
  styleUrls: ['./add-in-listing.component.scss']
})
export class AddInListingComponent implements OnInit {
  isApiLoading: boolean = false;
  Address: string | null = "";
  data1: any;
  errorMsg: any;
  createNftForm!:FormGroup;
  submitted = false;
  currencyList: any;
  blockchainList: any;
  isSaleApproved: boolean=false;
  isContractApproved: any;
  wrongNetwork: boolean=false;
  btnText: string="Add now";
  
  constructor(public dialogRef: MatDialogRef<AddInListingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService : GetDataService,
    private contractService:ContractService,
    private toastrService:ToastrService,
    private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.isApiLoading = false;
    this.Address =  localStorage.getItem('address');
    this.createNftForm = this.formBuilder.group({
      fixedPrice : ['0'],
      minimunBid :[''],
      startingDate : [''],
      expirationDate : [''],
      isMultiple : [''],
      typeOfSale: ['1'],
      currencyId:['1']
      
    });
    this.checkNetwork();
    
    this.createNftForm.patchValue({
      currencyId:this.data.blockchainId
    });
   
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
    this.getCurrencyList();
   }
}

  get f()
  {
    return this.createNftForm.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  async getCurrencyList()
  {
     this.getDataService.getCurrencyList()
    .subscribe(
      (response:any) => {
        this.currencyList=response.data;
      });

      let isContractApproved = await this.contractService.isApprovedForAll(this.data.typeOfNft);
      this.isContractApproved = isContractApproved.hash;
  }

  getBlockchainList()
  {
     this.getDataService.getBlockchainList()
    .subscribe(
      (response:any) => {
        this.blockchainList=response.data;
      });
  }

  async addListingSave(formData:any)
  { 
   
    if(!this.isContractApproved)
    {
      await this.startSale();
    }
    this.btnText="Sign signatre";
    if(this.createNftForm.valid)
    {
    this.isApiLoading = true;
    var price = formData.fixedPrice;
    if(formData.typeOfSale==3)
    {
      price = formData.minimunBid;
    }
    var status:any;
    let salt = 0;
   
    if(formData.typeOfSale==1){
      salt = this.contractService.randomNo();
      var userDate= JSON.parse(localStorage.getItem("userData") ?? "{}");

        status = await this.contractService.signSellOrder(this.data.ID,price,this.data.supply, this.data.nftAddress,this.data.isMultiple,salt,userDate?.userInfo.referralAddress,this.data.royalties,this.data.royaltiesOwner);
    }
    else
    {
        status = await this.contractService.signBidOrder(this.data.ID,price,this.data.supply, this.data.nftAddress,this.data.isMultiple);

    }
   
    if(status.status){
    
    this.data1= {
      nftId:this.data.ID,
      walletAddress:this.Address,
      signature : status.signature,
      currentSupply : this.data.supply,
      price : price,
      collectionId : this.data.collectionId,
      blockchainId : this.data.blockchainId,
      typeOfSale : formData.typeOfSale,
      supply : this.data.supply,
      nftAddress : this.data.nftAddress,
      isMultiple : this.data.isMultiple,
      salt : salt
    };
    
    console.log(this.data1);
    
    this.getDataService.addInListingForSaleSave(
      this.data1
    ).subscribe((result:any)=>
    {
     
      if(result.isSuccess)
      {
        
        this.errorMsg = result.message;
        this.getDataService.subjectTo.next({"addlisting":true});
        this.toastrService.success(this.errorMsg);

        this.isApiLoading = false;
        this.dialogRef.close();
      }
      else
      {

        this.errorMsg = result.message;
        this.toastrService.error(this.errorMsg);
        this.isApiLoading = false;
        this.dialogRef.close();
        
      }
    
    })
  }
  }
}

async startSale() {
  var status: any;
  this.btnText = "Approve For sale";

  status = await this.contractService.setApprovalForAll(this.data.isMultiple ? 'multiple' : 'single');
  if (status.status) {
    this.isSaleApproved = true;
    this.btnText = "Sign Signature";
  }
  else {
    this.isSaleApproved = false;
    this.btnText = "Add now";
  }
}
  
  

}
