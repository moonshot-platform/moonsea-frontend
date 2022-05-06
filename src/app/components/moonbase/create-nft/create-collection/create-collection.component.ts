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
  AbstractControl,
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
  // addCollectionForm: FormGroup;
  step01Form: FormGroup;
  step02Form: FormGroup;
  step03Form: FormGroup;
  step04Form: FormGroup;
  imageErrorMsg: boolean;
  addCollectionForm_New :any = {
    tokenName:null,
    walletAddress: null,
    fileUrl: null,
    collectionCoverPhoto: null,
    symbol: null,
    description: null,
    categoryId: null,
    yourSite: null,
    discord: null,
    twitter: null,
    instagram: null,
    medium: null,
    telegram: null,
    royalties:null,
    nftDefaultDescription: null,
    putOnSale: null,
    typeOfSale: null,
    timeAuction: null,
    minimunBid: null,
    startDate: null,
    endDate: null,
    openForBid: null,
    propertysize:[],
    nftAddress: null,
    isMultiple: null,
    nftId :null,
  }

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
    private _router: Router,
  ) {}

  imageUrl = '';
  isSuccess = false;

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.Address = localStorage.getItem('address');
    this.getCategotyList();
    this.collectionId = this.data.collectionId;

    // this.addCollectionForm = this.formbuider.group({
    //   tokenName: ['', [Validators.required]],
    //   walletAddress: [''],
    //   fileUrl: [''],
    //   collectionCoverPhoto: [''],
    //   symbol: ['', [Validators.required]],
    //   description: ['', [Validators.required]],
    //   categoryId: ['1', [Validators.required]],
    //   yourSite: [''],
    //   discord: [''],
    //   twitter: [''],
    //   instagram: [''],
    //   medium: [''],
    //   telegram: [''],
    //   royalties: [
    //     '',
    //     [Validators.required, Validators.pattern('^[0-9]{1,2}?$')],
    //   ],
    //   nftDefaultDescription: ['', [Validators.required]],
    //   putOnSale: [false],
    //   typeOfSale: ['1'],
    //   timeAuction: [''],
    //   minimunBid: [''],
    //   startDate: [''],
    //   endDate: [''],
    //   openForBid: [''],
    //   propertysize: this.formbuider.array([this.addpropertysize010()]),
    //   nftAddress: [''],
    //   isMultiple: [''],
    // });

    this.step01Form = this.formbuider.group({
      tokenName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.step02Form = this.formbuider.group({
      yourSite: [''],
      discord: [''],
      twitter: [''],
      instagram: [''],
      medium: [''],
      telegram: [''],
    });

    this.step03Form = this.formbuider.group({
      symbol: ['', [Validators.required]],
      royalties: [
        '',
        [Validators.required,Validators.min(0),Validators.max(10), Validators.pattern('^[0-9]{1,2}?$')],
      ],
      categoryId: ['1', [Validators.required]],
    });


    this.step04Form = this.formbuider.group({
      nftDefaultDescription: ['', [Validators.required]],
      propertysize: this.formbuider.array([this.addpropertysize010()]),
      putOnSale: [false],
      typeOfSale: ['1'],
      minimunBid: [''],
      startDate: [''],
      endDate: [''],
    });





    this.step04Form.get('putOnSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    this.step04Form
      .get('typeOfSale')
      ?.valueChanges.subscribe((value) => {
        this.setTypeOfSale();
      });


      this.step01Form.get('tokenName').valueChanges.subscribe((value:any)=>{
        this.checkCollectionName(value);
      })




    if (this.collectionId) {
      let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
      this.getDataService.getRequest(url).subscribe((res: any) => {
        if (res.status == 200) {
          this.imagePath = res.data.fileUrl;
          this.step01PatchValue(res.data);
          this.step02PatchValue(res.data);
          this.step03PatchValue(res.data);
          this.step04PatchValue(res.data);

          // this.addCollectionForm.patchValue(res.data);
          // this.addCollectionForm.patchValue({
          //   typeOfSale: res.data.typeOfSale.toString(),
          // });
          // let data = res.data.propertysize;
          // (this.addCollectionForm.controls.propertysize as FormArray).clear();
          // data.forEach((element: any) => {
          //   (this.addCollectionForm.controls.propertysize as FormArray).push(
          //     this.formbuider.group({
          //       properties: element.properties,
          //       size: element.size,
          //     })
          //   );
          // });
        }
      });
    }
  }

  // get formControls() {
  //   return this.addCollectionForm.controls;
  // }

  get step01FormControls() {
    return this.step01Form.controls;
  }

  get step02FormControls() {
    return this.step02Form.controls;
  }

  get step03FormControls() {
    return this.step03Form.controls;
  }

  get step04FormControls() {
    return this.step04Form.controls;
  }

  // get propertysize01(): FormArray {
  //   return this.addCollectionForm.controls['propertysize'] as FormArray;
  // }
  get propertysize01(): FormArray {
    return this.step04Form.controls['propertysize'] as FormArray;
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
  toggleTypeOfNft(typeOfNft: any) {
    if (typeOfNft == 'single') {
      this.typeOfNft = 'multiple';
    }

    if (typeOfNft == 'multiple') {
      this.typeOfNft = 'single';
    }
  }

  toggleTypeOfNft01(event:any){
    console.log(event);
    
  }

  step01PatchValue(data:any){
    this.step01Form.patchValue({
      tokenName: data.tokenName,
      description:data.description,
    })
  }

  step02PatchValue(data:any){
    this.step02Form.patchValue({
      yourSite: data.yourSite,
      discord: data.discord,
      twitter: data.twitter,
      instagram: data.instagram,
      medium: data.medium,
      telegram: data.telegram,
    })
  }

  step03PatchValue(data:any){
    this.step03Form.patchValue({
      symbol:data.symbol,
      royalties:data.royalties,
      categoryId:data.categoryId,
    })
  }

  step04PatchValue(data:any){
    this.step04Form.patchValue({
      nftDefaultDescription:data.nftDefaultDescription,
      putOnSale:  data.putOnSale,
      typeOfSale: data.typeOfSale.toString(),
      minimunBid: data.minimunBid,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    
    let data01 = data.propertysize;
    (this.step04Form.controls.propertysize as FormArray).clear();
    data01.forEach((element: any) => {
      (this.step04Form.controls.propertysize as FormArray).push(
        this.formbuider.group({
          properties: element.properties,
          size: element.size,
        })
      );
    });
  }



  saveStep01(value: any) {
    this.imageErrorMsg = false;

    if (this.step01Form.valid) {
      if(this.imagePath){
        this.addCollectionForm_New.tokenName = this.step01Form.value.tokenName;
        this.addCollectionForm_New.description = this.step01Form.value.description;
        this.collectionDetailsFunc();
      }else{
        this.imageErrorMsg = true;
      }
     
    }
  }

  saveStep02(value: any) {
    if (this.step02Form.valid) {
      this.addCollectionForm_New.yourSite = this.step02Form.value.yourSite;
      this.addCollectionForm_New.discord = this.step02Form.value.discord;
      this.addCollectionForm_New.twitter = this.step02Form.value.twitter;
      this.addCollectionForm_New.instagram = this.step02Form.value.instagram;
      this.addCollectionForm_New.medium = this.step02Form.value.medium;
      this.addCollectionForm_New.telegram = this.step02Form.value.telegram;
  
      this.collectionDetailsFunc();
    }
  }
  saveStep03(value: any) {
    if (this.step03Form.valid) {
      this.addCollectionForm_New.symbol = this.step03Form.value.symbol;
      this.addCollectionForm_New.royalties = this.step03Form.value.royalties;
      this.addCollectionForm_New.categoryId = this.step03Form.value.categoryId;
  
      this.collectionDetailsFunc();
    }
  }

  saveStep04(value: any) {
    if (this.step04Form.valid) {
      this.addCollectionForm_New.nftDefaultDescription = this.step04Form.value.nftDefaultDescription;
      this.addCollectionForm_New.propertysize = this.step04Form.value.propertysize;
      this.addCollectionForm_New.putOnSale = this.step04Form.value.putOnSale; 
      if(this.step04Form.value.putOnSale){
        this.addCollectionForm_New.minimunBid = this.step04Form.value.minimunBid; 
      }else{
        this.addCollectionForm_New.minimunBid = 0;
      }


      this.addCollectionForm_New.typeOfSale = this.step04Form.value.typeOfSale;
      this.addCollectionForm_New.startDate = this.datepipe.transform(
        this.step04Form.controls.startDate.value,
        'yyyy-MM-ddTHH:mm:ss'
      );
      this.addCollectionForm_New.endDate = this.datepipe.transform(
        this.step04Form.controls.endDate.value,
        'yyyy-MM-ddTHH:mm:ss'
      );
      this.addCollectionForm_New.nftAddress = this.typeOfNft == 'single' ? this.cs.nft721Address : this.cs.nft1155Address;
      this.addCollectionForm_New.isMultiple = this.typeOfNft == 'single' ? 'false' : 'true';
      this.addCollectionForm_New.fileUrl =  this.imagePath;
      this.addCollectionForm_New.nftId =  this.data.ID;
      this.addCollectionForm_New.walletAddress =  this.Address;
      
      this.saveCollection(this.addCollectionForm_New);
      
      
    }
  }

  saveCollection(data: any) {
   

    this.isApiLoading = true;
    this.isSubmitted = true;

   
      if (!this.collectionId) {
        this.createNFT.addCollection(data).subscribe((result: any) => {
          if (result.isSuccess) {
            this.dialogRef.close();
            this.createNFT.subject.next({ tabIndex: 2 });
            this._router.navigate([], {
              queryParams: {
                collectionName: this.addCollectionForm_New.tokenName,
                collectionId: result.data.collectionId,
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
                collectionName: this.addCollectionForm_New.tokenName,
                collectionId: this.collectionId,
              },
              queryParamsHandling: 'merge',
            });
          } else {
            this.getDataService.showToastr(res.message, res.isSuccess);
            this.isApiLoading = false;
          }
        });
      }
   
  }

  skip(){
    this.dialogRef.close();
    this.createNFT.subject.next({ tabIndex: 2 });
    this._router.navigate([], {
      queryParams: {
        collectionName: this.step01Form.value.tokenName,
        collectionId: this.collectionId,
      },
      queryParamsHandling: 'merge',
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onLogoFile(event: any) {
    this.imageErrorMsg = false;
    const file: File = event.target.files[0];
    debugger
    if (file && (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg'  || file.type == 'image/gif')) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      this.createNFT.uploadFile(file).subscribe(
        (response: any) => {
          let data = response;
         
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

  checkCollectionName(collection_name:any) {
   
    let body = {
      collectionName: collection_name
    };

    let url = 'api/checkCollectionNameValidation';
    if (collection_name.length >= 3) {
      this.createNFT.postRequest(url, body).subscribe((res: any) => {
        if (res.status == 200) {
          this.isShowNameValidation = false;
          this.step01Form.controls.tokenName.setErrors(null)
        } else {
          this.isShowNameValidation = true;
          if(!this.collectionId){
            this.step01Form.controls.tokenName.setErrors({'incorrect': true})
          }
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
    // console.log(this.step04Form.get('putOnSale')?.value);

    console.log(this.step04Form.get('typeOfSale')?.value);
    

    if (this.step04Form.get('putOnSale')?.value) {
      if (this.step04Form.get('typeOfSale')?.value == 1) {
        this.step04Form
          .get('minimunBid')
          ?.setValidators(Validators.required);

          this.step04Form.get('startDate').clearValidators();
          this.step04Form.get('startDate').updateValueAndValidity();
          this.step04Form.get('endDate').clearValidators();
          this.step04Form.get('endDate').updateValueAndValidity();
      } 

      if (this.step04Form.get('typeOfSale')?.value == 2) {
        this.step04Form
          .get('minimunBid')
          ?.setValidators(Validators.required);
        this.step04Form
          .get('startDate')
          ?.setValidators(Validators.required);
        this.step04Form
          .get('endDate')
          ?.setValidators(Validators.required);
      }

      if (this.step04Form.get('typeOfSale')?.value == 3) {
        this.step04Form
          .get('minimunBid')
          ?.setValidators(Validators.required);

          this.step04Form.get('startDate').clearValidators();
          this.step04Form.get('startDate').updateValueAndValidity();
          this.step04Form.get('endDate').clearValidators();
          this.step04Form.get('endDate').updateValueAndValidity();
      }
    } else {
      this.step04Form.get('minimunBid').clearValidators();
      this.step04Form.get('minimunBid').updateValueAndValidity();
      this.step04Form.get('startDate').clearValidators();
      this.step04Form.get('startDate').updateValueAndValidity();
      this.step04Form.get('endDate').clearValidators();
      this.step04Form.get('endDate').updateValueAndValidity();
    }
  }
}




