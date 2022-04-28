import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { ContractService } from 'src/app/services/contract.service';
import { ModalForCreateNftComponent } from '../modal-for-create-nft/modal-for-create-nft.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-collection',
  templateUrl: './create-collection.component.html',
  styleUrls: ['./create-collection.component.scss'],
})
export class CreateCollectionComponent implements OnInit {
  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  isApiLoading: boolean = false;
  isSubmitted = false;
  Address: any;
  categotyList: any;
  collectionId: any;
  imagePath: any = '';
  collectionDetails = 1;
  socialLinks = false;
  nftDetails = false;
  dateValue: Date = new Date();
  typeOfNft: any = 'single';
  addCollectionForm: FormGroup;
  imageErrorMsg: boolean;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createNFT: CreateNftService,
    private getDataService: GetDataService,
    private formbuider: FormBuilder,
    private cs: ContractService,
    public datepipe: DatePipe,
    private createNftService: CreateNftService,
    private _Activatedroute: ActivatedRoute,
    private _router: Router
  ) {}

  imageUrl = '';
  isSuccess = false;

  ngOnInit(): void {
    this.Address = localStorage.getItem('address');
    this.getCategotyList();
    this.collectionId = this.data.collectionId;

    this.addCollectionForm = this.formbuider.group({
      tokenName: ['', [Validators.required]],
      walletAddress: [''],
      fileUrl: [''],
      collectionCoverPhoto: [''],
      symbol: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: ['1', [Validators.required]],
      yourSite: [''],
      discord: [''],
      twitter: [''],
      instagram: [''],
      medium: [''],
      telegram: [''],
      royalties: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{1,2}?$')],
      ],
      nftDefaultDescription: ['', [Validators.required]],
      putOnSale: [false],
      typeOfSale: ['1'],
      timeAuction: [''],
      minimunBid: [''],
      startDate: [''],
      endDate: [''],
      openForBid: [''],
      propertysize: this.formbuider.array([this.addpropertysize010()]),
      nftAddress :[''],
      isMultiple:['']
    });

    this.addCollectionForm.get('putOnSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    this.addCollectionForm
      .get('typeOfSale')
      ?.valueChanges.subscribe((value) => {
        this.setTypeOfSale();
      });

    if (this.collectionId) {
      let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
      this.getDataService.getRequest(url).subscribe((res: any) => {
        if (res.status == 200) {
          this.imagePath = res.data.fileUrl;
          this.addCollectionForm.patchValue(res.data);
          this.addCollectionForm.patchValue({
            typeOfSale: res.data.typeOfSale.toString(),
          });
          let data = res.data.propertysize;
          (this.addCollectionForm.controls.propertysize as FormArray).clear();
          data.forEach((element: any) => {
            (this.addCollectionForm.controls.propertysize as FormArray).push(
              this.formbuider.group({
                properties: element.properties,
                size: element.size,
              })
            );
          });
        }
      });
    }
  }

  get formControls() {
    return this.addCollectionForm.controls;
  }

  get propertysize01(): FormArray {
    return this.addCollectionForm.controls['propertysize'] as FormArray;
  }

  addpropertysize() {
    this.propertysize01.push(this.addpropertysize010());
  }

  addpropertysize010() {
    return this.formbuider.group({
      properties: ['', [Validators.required]],
      size: ['', [Validators.required]],
    });
  }

  deletepropertysize01(lessonIndex: number) {
    this.propertysize01.removeAt(lessonIndex);
  }
  toggleTypeOfNft(typeOfNft:any){
    
    if(typeOfNft == 'single'){
      this.typeOfNft = 'multiple';
    }

    if(typeOfNft == 'multiple'){
      this.typeOfNft = 'single';
    }
  }

  saveCollection(data: any) {
    this.imageErrorMsg = false;

    this.isApiLoading = true;
    this.isSubmitted = true;

    data.nftId = this.data.ID;
    data.walletAddress = this.Address;
    data.fileUrl = this.imagePath;
    data.startDate = this.datepipe.transform(
      this.addCollectionForm.controls.startDate.value,
      'yyyy-MM-ddTHH:mm:ss'
    );

    data.endDate = this.datepipe.transform(
      this.addCollectionForm.controls.endDate.value,
      'yyyy-MM-ddTHH:mm:ss'
    );
    data.nftAddress =  this.typeOfNft == 'single'
    ? this.cs.nft721Address
    : this.cs.nft1155Address;

    if (data.minimunBid == '') {
      data.minimunBid = 0;
    }

    data.isMultiple = this.typeOfNft == 'single' ? 'false' : 'true';

    if (this.imagePath) {
      if (!this.collectionId) {
        this.createNFT.addCollection(data).subscribe((result: any) => {
          if (result.isSuccess) {
            this.dialogRef.close();
            this.createNFT.subject.next({ tabIndex: 2 });
            this._router.navigate([], {
              queryParams: {
                collectionName: this.addCollectionForm.value.tokenName,
                collectionId : result.data.collectionId
              },
              queryParamsHandling: 'merge',
            });
          }
          this.isSuccess = result.isSuccess;
          this.getDataService.showToastr(result.message, result.isSuccess);
          this.isApiLoading = false;
        });
      } else {
        let url = 'api/updateCollectionSave';
        this.createNFT.postRequest(url, data).subscribe((res: any) => {
          if (res.status == 200) {
            this.getDataService.showToastr(res.message, res.isSuccess);
            this.isApiLoading = false;
            this.dialogRef.close();
            this.createNFT.subject.next({ tabIndex: 2 });
            this._router.navigate([], {
              queryParams: {
                collectionName: this.addCollectionForm.value.tokenName,
                collectionId : this.collectionId
              },
              queryParamsHandling: 'merge',
            });
          } else {
            this.getDataService.showToastr(res.message, res.isSuccess);
            this.isApiLoading = false;
          }
        });
      }
    } else {
      this.imageErrorMsg = true;
    }


  }

  close(): void {
    this.dialogRef.close();
  }

  onLogoFile(event: any) {
    this.imageErrorMsg = false;
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      this.createNFT.uploadFile(file).subscribe(
        (response: any) => {
          let data = response;
          console.log(data);

          if (response.type === HttpEventType.UploadProgress) {
          } else if (response instanceof HttpResponse) {
            if (response.body.isSuccess) {
              this.imageErrorMsg = false;
              this.imagePath = response.body.data.path;
            } else {
              this.imageErrorMsg = true;
              this.imagePath = '';
            }
          }
        },
        (error: any) => {
          this.imageErrorMsg = true;
          this.imagePath = '';
        }
      );
    }
  }

  getCategotyList() {
    this.createNFT.getCategotyList().subscribe((response: any) => {
      if (response.isSuccess) {
        this.categotyList = response.data;
      }
    });
  }

  isShowNameValidation: boolean = false;

  checkCollectionName() {
    console.log(this.addCollectionForm.controls['tokenName'].value.length);
    let body = {
      collectionName: this.addCollectionForm.controls['tokenName'].value,
    };

    let url = 'api/checkCollectionNameValidation';
    if (this.addCollectionForm.controls['tokenName'].value.length >= 3) {
      this.createNFT.postRequest(url, body).subscribe((res: any) => {
        console.log(res);
        if (res.status == 200) {
          this.isShowNameValidation = true;
        } else {
          this.isShowNameValidation = false;
        }
      });
    } else {
      this.isShowNameValidation = false;
    }
  }

  collectionDetailsFunc() {
    this.collectionDetails++;
  }

  prev() {
    this.collectionDetails--;
  }

  openDialogSubmitNFT(data: any): void {
    const dialogRef = this.dialog.open(ModalForCreateNftComponent, {
      width: 'auto',
      disableClose: true,
      data: {
        details: data,
        globalService: this.cs,
        typeOfNft: this.typeOfNft,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  setTypeOfSale() {  
    if (this.addCollectionForm.get('putOnSale')?.value) {
      if (this.addCollectionForm.get('typeOfSale')?.value == 1) {
        this.addCollectionForm
          .get('minimunBid')
          ?.setValidators(Validators.required);
      }else{
        this.addCollectionForm.get('startDate')?.clearValidators();
        this.addCollectionForm.get('endDate')?.clearValidators();
      }

      if (this.addCollectionForm.get('typeOfSale')?.value == 2) {
        this.addCollectionForm.get('minimunBid')?.setValidators(Validators.required);
        this.addCollectionForm.get('startDate')?.setValidators(Validators.required);
        this.addCollectionForm.get('endDate')?.setValidators(Validators.required);
      } 

      if (this.addCollectionForm.get('typeOfSale')?.value == 3) {
        this.addCollectionForm.get('minimunBid')?.setValidators(Validators.required);
      }else{
        this.addCollectionForm.get('startDate')?.clearValidators();
        this.addCollectionForm.get('endDate')?.clearValidators();
      }
    } else {
      this.addCollectionForm.get('minimunBid')?.clearValidators();
      this.addCollectionForm.get('startDate')?.clearValidators();
      this.addCollectionForm.get('endDate')?.clearValidators();
    }
  

  }
}
