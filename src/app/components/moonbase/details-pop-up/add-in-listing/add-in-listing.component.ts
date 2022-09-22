import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { SignSellOrder01 } from 'src/app/model/signBuyerOrder';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-in-listing',
  templateUrl: './add-in-listing.component.html',
  styleUrls: ['./add-in-listing.component.scss'],
})
export class AddInListingComponent implements OnInit {
  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  isApiLoading: boolean = false;
  Address: string | null = '';
  data1: any;
  errorMsg: any;
  createNftForm!: FormGroup;
  submitted = false;
  currencyList: any = [];
  blockchainList: any;
  isSaleApproved: boolean = false;
  isContractApproved: any;
  wrongNetwork: boolean = false;
  btnText: string = 'Complete Listing';
  serviceFees: any;
  dateValue: Date = new Date();
  constructor(
    public dialogRef: MatDialogRef<AddInListingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getDataService: GetDataService,
    private contractService: ContractService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private pricingApi: PricingApiService,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.isApiLoading = false;
    this.Address = localStorage.getItem('address');
    this.createNftForm = this.formBuilder.group({
      fixedPrice: ['0'],
      minimunBid: [''],
      startingDate: [''],
      expirationDate: [''],
      isMultiple: [''],
      typeOfSale: ['1'],
      currencyId: ['1'],
      noOfDaysAuction:[3]
    });
    this.checkNetwork();

    this.createNftForm.patchValue({
      currencyId: this.data.blockchainId,
    });

    this.pricingApi.getServiceFee();
    this.serviceFees = this.pricingApi.serviceFees;

    this.createNftForm.get('typeOfSale').valueChanges.subscribe((res:any)=>{
      this.setValidation(res);
    });
  }

  async checkNetwork() {
    // //debugger
    let checkNetwork: boolean = await this.contractService.createContract(
      this.data.blockchainId
    );
    if (!checkNetwork) {
      this.wrongNetwork = true;
      let chainIdd = this.contractService.chainId;
      let switchNetwork = this.contractService.switchNetwork(chainIdd);
      switchNetwork.then(
        (res: any) => {
          if (res == 'doneeeeee') {
            this.wrongNetwork = false;
          }
        },
        (err: any) => {
          this.wrongNetwork = true;
        }
      );
    } else {
      this.wrongNetwork = false;
      this.getCurrencyList();
    }
  }

  get f() {
    return this.createNftForm.controls;
  }

  onNoClick(): void {
    // //debugger
    this.dialogRef.close();
  }

  async getCurrencyList() {
    this.getDataService.getCurrencyList().subscribe((response: any) => {
      this.currencyList = response.data;

    });

    let isContractApproved = await this.contractService.isApprovedForAll(
      this.data.typeOfNft,
      this.data.blockchainId,
      this.data.nftAddress
    );
    this.isContractApproved = isContractApproved.hash;
  }

  getBlockchainList() {
    this.getDataService.getBlockchainList().subscribe((response: any) => {
      this.blockchainList = response.data;
    });
  }

  async addListingSave(formData: any) {

    debugger
    if (!this.isContractApproved) {
      await this.startSale();
    }
    this.btnText = 'Sign';
    if (this.createNftForm.valid) {
      this.isApiLoading = true;
      var price = formData.fixedPrice;
      if (formData.typeOfSale == 3) {
        price = formData.minimunBid;
      }
      var status: any;
      let salt = 0;

      if (formData.typeOfSale == 1) {
        salt = this.contractService.randomNo();
        var userDate = JSON.parse(localStorage.getItem('userData') ?? '{}');


        if (!userDate) {
          this.contractService.isRegisterd.next("not register");
          return;
        }
        let sig: SignSellOrder01;
        sig = {
          nftId: this.data.ID,
          price: price,
          supply: this.data.ownerCurrentSupply,
          nftAddress: this.data.nftAddress,
          isMultiple: this.data.isMultiple,
          salt: salt,
          referralAddress: userDate?.referralAddress,
          royalties: this.data.royalties,
          royaltiesOwner: this.data.royaltiesOwner ?? '0x0000000000000000000000000000000000000000',
          tokenAddress: '0x0000000000000000000000000000000000000000',
          blockchainId: this.data.blockchainId
        }
        status = await this.contractService.signSellOrder(sig);
      } else {
        debugger
        status = await this.contractService.signBidOrder(
          this.data.ID,
          price,
          this.data.supply,
          this.data.nftAddress,
          this.data.isMultiple
        );
      }
      debugger
      if (status.status) {
        this.data1 = {
          nftId: this.data.ID,
          walletAddress: this.Address,
          signature: status.signature,
          currentSupply: this.data.ownerCurrentSupply,
          price: price,
          collectionId: this.data.collectionId,
          blockchainId: this.data.blockchainId,
          typeOfSale: formData.typeOfSale,
          supply: this.data.supply,
          nftAddress: this.data.nftAddress,
          isMultiple: this.data.isMultiple,
          salt: salt,
          asset: this.data.asset,
          startDate:this.datepipe.transform(this.createNftForm.value.startingDate,'yyyy-MM-ddTHH:mm:ss'),
          noOfDaysAuction:this.createNftForm.value.noOfDaysAuction,
        };


        this.getDataService
          .addInListingForSaleSave(this.data1)
          .subscribe((result: any) => {
            // if (result.isSuccess) {
              this.errorMsg = result.message;
              this.getDataService.subjectTo.next({ addlisting: true });
              this.toastrService.success(this.errorMsg);

              this.isApiLoading = false;
              this.dialogRef.close();
              window.location.reload();
            // } else {
            //   this.errorMsg = result.message;
            //   this.toastrService.error(this.errorMsg);
            //   this.isApiLoading = false;
            //   this.dialogRef.close();
            // }
          });
      } else {
        this.isApiLoading = false;
      }
    }
  }

  async startSale() {
    var status: any;
    this.btnText = 'Approve For sale';

    status = await this.contractService.setApprovalForAll(
      this.data.isMultiple == 'multiple',
      this.data.blockchainId,
      this.data.nftAddress
    );
    if (status.status) {
      this.isSaleApproved = true;
      this.btnText = 'Sign';
    } else {
      this.isSaleApproved = false;
      this.btnText = 'Add now';
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  setValidation(typeOfSale:any){
    if(typeOfSale == 2){
      this.createNftForm.get('startingDate')?.setValidators([Validators.required]);
      this.createNftForm.get('startingDate')?.updateValueAndValidity();
    }else{
      this.createNftForm.get('startingDate')?.clearValidators();
      this.createNftForm.get('startingDate')?.updateValueAndValidity();
    }
  }
}
