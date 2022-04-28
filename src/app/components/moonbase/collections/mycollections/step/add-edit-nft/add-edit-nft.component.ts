import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-add-edit-nft',
  templateUrl: './add-edit-nft.component.html',
  styleUrls: ['./add-edit-nft.component.scss'],
})
export class AddEditNftComponent implements OnInit {
  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  addEditNft: FormGroup;
  dateValue: Date = new Date();
  isApiLoading: boolean;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditNftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe,
    private _getDataService :GetDataService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    
    this.addEditNft = this.fb.group({
      title :['',[Validators.required]],
      nftTokenID: [''],
      nftDefaultDescription: ['', [Validators.required]],
      propertysize: this.fb.array([this.propertysizeGroup()]),
      putOnSale: [false],
      typeOfSale: ['1'],
      minimunBid: [''],
      startDate: [''],
      endDate: [''],
      currentSupply: [''],
      royalties: [''],
      isMultiple :[false],
      nftAddress : ['']
    });

    this.addEditNft.get('putOnSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    this.addEditNft.get('typeOfSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    if (this.data) {
      this.addEditNft.patchValue({
        title:this.data.title,
        nftDefaultDescription: this.data.description,
        propertysize: this.data.propertysize,
        putOnSale: this.data.isForSale,
        typeOfSale: this.data.typeOfSale.toString(),
        minimunBid: this.data.minimunBid,
        startDate: this.data.startingDate,
        endDate: this.data.expirationDate,
        nftTokenID: this.data.nftTokenID,
        currentSupply: this.data.currentSupply,
        royalties: this.data.royalties,
        isMultiple :this.data.isMultiple,
        nftAddress :this.data.nftAddress
      });

      (this.addEditNft.controls.propertysize as FormArray).clear();
      this.data.propertysize.forEach((element: any) => {
        (this.addEditNft.controls.propertysize as FormArray).push(
          this.fb.group({
            properties: element.properties,
            size: element.size,
          })
        );
      });
    }
  }

  get formControls() {
    return this.addEditNft.controls;
  }

  get propertysize01(): FormArray {
    return this.addEditNft.controls['propertysize'] as FormArray;
  }

  propertysizeGroup() {
    return this.fb.group({
      size: ['', [Validators.required]],
      properties: ['', [Validators.required]],
    });
  }

  addProperies() {
    this.propertysize01.push(this.propertysizeGroup());
  }

  deletepropertysize01(index: any) {
    this.propertysize01.removeAt(index);
  }

  close(): void {
    this.dialogRef.close();
  }

  saveNFT(value: any) {
    this.addEditNft.value.startDate = this.datepipe.transform(
      this.addEditNft.controls.startDate.value,
      'yyyy-MM-ddTHH:mm:ss'
    );
    this.addEditNft.value.endDate = this.datepipe.transform(
      this.addEditNft.controls.endDate.value,
      'yyyy-MM-ddTHH:mm:ss'
    );
    
    let url ="api/UpdateNftToken";
    this._getDataService.postRequest(url,this.addEditNft.value).subscribe((res:any)=>{
      console.log(res);
      if(res.status == 200){
        this._getDataService.showToastr(res.message,res.isSuccess);
        this.close();
      }else{
        this._getDataService.showToastr(res.message,res.isSuccess);
      }
      
    },(err:any)=>{
      this._getDataService.showToastr(err,false);
    })
  }
  setTypeOfSale() {
    
    if (this.addEditNft.get('putOnSale')?.value) {
      if (this.addEditNft.get('typeOfSale')?.value == 1) {
        this.addEditNft
          .get('minimunBid')
          ?.setValidators(Validators.required);
      }else{
        this.addEditNft.get('startDate')?.clearValidators();
        this.addEditNft.get('endDate')?.clearValidators();
      }

      if (this.addEditNft.get('typeOfSale')?.value == 2) {
        this.addEditNft.get('minimunBid')?.setValidators(Validators.required);
        this.addEditNft.get('startDate')?.setValidators(Validators.required);
        this.addEditNft.get('endDate')?.setValidators(Validators.required);
      } 

      if (this.addEditNft.get('typeOfSale')?.value == 3) {
        this.addEditNft.get('minimunBid')?.setValidators(Validators.required);
      }else{
        this.addEditNft.get('startDate')?.clearValidators();
        this.addEditNft.get('endDate')?.clearValidators();
      }
    } else {
      this.addEditNft.get('minimunBid')?.clearValidators();
      this.addEditNft.get('startDate')?.clearValidators();
      this.addEditNft.get('endDate')?.clearValidators();
    }
  
  }
}
