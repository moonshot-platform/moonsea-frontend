import { Component, OnInit, ViewChild, NgZone, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { stat } from 'fs';
import { CreateCollectionComponent } from './create-collection/create-collection.component';
import { ModalForCreateNftComponent } from './modal-for-create-nft/modal-for-create-nft.component';
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';

declare var $: any;

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.scss'],
})
export class CreateNftComponent implements OnInit {
  createNftForm!: FormGroup;

  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  isUploadButtonDisabled: boolean = false;
  imageUrl: string =
    'https://moonboxes.io/assets/media/images/astro_painter.svg';
  imagePath: any;
  submitted: boolean = false;
  typeOfNft: any;
  tokenId: any = 0;
  minDate: Date = new Date();
  collectionList = [];
  maxDate: Date = new Date();
  dateValue: Date = new Date();
  nftDetails: any;
  showPopup: boolean = false;
  collectionId: any;
  //currencyList: any;
  blockchainList: any;
  userAddress: any;
  isShowMatspinner = 'hide';
  royalties:any;

  constructor(
    private route: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private cs: ContractService,
    private createNFTService: CreateNftService,
    public datepipe: DatePipe,
    private ngZone: NgZone,
    public dialog: MatDialog
  ) {
    _activatedRoute.params.subscribe(
      (params) => (this.typeOfNft = params['type'])
    );
  }

  ngOnInit(): void {
    this.cs.getWalletObs().subscribe((data: any) => {
      this.userAddress = data;
      // console.log(this.cs.checkValidAddress(this.userAddress))
      if (!this.cs.checkValidAddress(this.userAddress)) {
        this.route.navigate(['connect']);
      }
    });

    window.scrollTo(0, 0);
    this.propertyAndsize();

    this.createNftForm = this.formBuilder.group({
      title: [''],
      description: [''],
      // royalties: [
      //   '',
      //   [Validators.min(0), Validators.max(80), Validators.pattern('^[0-9]*$')],
      // ],
      numberOfCopies: [
        '1',
        [ Validators.min(1), Validators.max(10000000),Validators.pattern('^[0-9]*$'), ],
      ],
      propertysize: this.formBuilder.array([this.propertyAndsize()]),
      alternativeText: [''],
      fixedPrice: ['0'],
      // currencyId: ['1'],
      blockchainId: ['1'],
      minimunBid: [''],
      startingDate: [''],
      expirationDate: [''],
      isMultiple: [''],
      isForSale: [false],
      protectionTime: [''],
      typeOfSale: ['1'],
      unlockData: [''],
      referralAddress: [''],
      isUnlock: [''],
    });

    this.createNftForm.get('properties')?.clearValidators();
    this.createNftForm.get('alternativeText')?.clearValidators();
    this.createNftForm.get('numberOfCopies')?.clearValidators();

    this.createNftForm.get('isForSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    this.createNftForm.get('typeOfSale')?.valueChanges.subscribe((value) => {
      this.setTypeOfSale();
    });

    this.createNftForm.get('isUnlock')?.valueChanges.subscribe((value) => {
      this.setUnlockText();
    });
    this.getTokenId();

    //this.getCurrencyList();
    this.getBlockchainList();
  }

  deletRow(index: number) {
    this.propertysize.removeAt(index);
  }
  get propertysize(): FormArray {
    return <FormArray>this.createNftForm.get('propertysize');
  }

  addInputs() {
    this.propertysize.push(this.propertyAndsize());
  }
  propertyAndsize(): FormGroup {
    return this.formBuilder.group({
      size: [null, ],
      properties: [null, ],
    });
  }

  createSignleNFT() {
    this.route.navigate(['createNft/type', 'single']);
  }
  createMultipleNFT() {
    this.route.navigate(['createNft/type', 'multiple']);
  }

  getTokenId() {
    this.collectionList = [];
    this.createNFTService
      .getTokenIdLatest(this.cs.userAddress)
      .subscribe((response) => (this.nftDetails = response.data));

    this.createNFTService
      .getCollectionList(this.cs.userAddress)
      .subscribe((response) => {
        this.collectionList = response.data;
        this.collectionId = this.collectionList[0]['collectionId'];
        this.setCollectionId(this.collectionId,this.collectionList[0]);
      });
  }

  getBlockchainList() {
    this.createNFTService.getBlockchainList().subscribe((response: any) => {
      this.blockchainList = response.data;
    });
  }

  // getCurrencyList() {
  //   this.createNFTService.getCurrencyList()
  //     .subscribe(
  //       (response: any) => {
  //         this.currencyList = response.data;
  //       });
  // }

  get f() {
    return this.createNftForm.controls;
  }

  setCollectionId(id: number,item:any) {
    this.royalties = item.royalties;
    this.collectionId = id;
  }

  setUnlockText() {
    if (this.createNftForm.get('isUnlock')?.value) {
      this.createNftForm
        .get('alternativeText')
        ?.setValidators(Validators.required);
    } else {
      this.createNftForm.get('alternativeText')?.clearValidators();
    }
  }

  setTypeOfSale() {
    if (this.createNftForm.get('isForSale')?.value) {
      if (this.createNftForm.get('typeOfSale')?.value == 1) {
        this.createNftForm
          .get('fixedPrice')
          ?.setValidators([
            Validators.required,
            Validators.min(0.001),
            Validators.max(1000),
          ]);
      } else {
        this.createNftForm.get('fixedPrice')?.clearValidators();
      }

      if (this.createNftForm.get('typeOfSale')?.value == 2) {
        this.createNftForm
          .get('minimunBid')
          ?.setValidators(Validators.required);
        this.createNftForm
          .get('startingDate')
          ?.setValidators(Validators.required);
        this.createNftForm
          .get('expirationDate')
          ?.setValidators(Validators.required);
      } else {
        this.createNftForm.get('minimunBid')?.clearValidators();
        this.createNftForm.get('startingDate')?.clearValidators();
        this.createNftForm.get('expirationDate')?.clearValidators();
      }

      if (this.createNftForm.get('typeOfSale')?.value == 3) {
        this.createNftForm
          .get('minimunBid')
          ?.setValidators(Validators.required);
      } else {
        this.createNftForm.get('minimunBid')?.clearValidators();
      }
    } else {
      this.createNftForm.get('fixedPrice')?.clearValidators();
      this.createNftForm.get('minimunBid')?.clearValidators();
      this.createNftForm.get('startingDate')?.clearValidators();
      this.createNftForm.get('expirationDate')?.clearValidators();
    }
    this.createNftForm.get('fixedPrice')?.updateValueAndValidity();
    this.createNftForm.get('minimunBid')?.updateValueAndValidity();
    this.createNftForm.get('startingDate')?.updateValueAndValidity();
    this.createNftForm.get('expirationDate')?.updateValueAndValidity();
  }

  showerrormsg = 'hide';

  onLogoFile(event: any) {
    this.showerrormsg = 'hide';
    this.isShowMatspinner = 'show';
    this.isUploadButtonDisabled = true;
    const file: File = event.target.files[0];
    // console.log(file);
    if (
      file.type == 'image/jpeg' ||
      file.type == 'image/png' ||
      file.type == 'image/jpg' ||
      file.type == 'video/mp4' ||
      file.type == 'image/gif'
    ) {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
          this.imageUrl = reader.result?.toString() ?? '';
        };
        this.createNFTService.uploadFile(file).subscribe(
          (response: any) => {
            this.isUploadButtonDisabled = false;
            if (response.isSuccess) {
              this.isShowMatspinner = 'hide';
              this.imagePath = response.data.path;
            } else {
              this.showerrormsg = 'show';
              this.isShowMatspinner = 'hide';
              this.imagePath = '';
            }
          },
          (error: any) => {
            this.isShowMatspinner = 'hide';
            this.showerrormsg = 'show';
            this.isUploadButtonDisabled = false;
            this.imagePath = '';
          }
        );
      }
    } else {
      this.toastr.error('please check file format....');
      this.isShowMatspinner = 'hide';
    }
  }

  async createNftSubmit(formData: any) {
    this.submitted = true;
 
    if (this.createNftForm.valid && this.imagePath.length > 0 ) 
    {

      formData.startingDate = this.datepipe.transform(
        this.createNftForm.controls.startingDate.value,
        'yyyy-MM-ddTHH:mm:ss'
      );
      formData.expirationDate = this.datepipe.transform(
        this.createNftForm.controls.expirationDate.value,
        'yyyy-MM-ddTHH:mm:ss'
      );
      formData.nftTokenId = this.nftDetails.nftTokenId + 22;
      formData.fileUrl = this.imagePath;
      formData.walletAddress = this.cs.userAddress;
      formData.protectionTime = this.nftDetails.protectionTime;
      formData.transactionHash = '';
      formData.nftAddress =
        this.typeOfNft == 'single'
          ? this.cs.nft721Address
          : this.cs.nft1155Address;
      formData.price = this.createNftForm.controls.typeOfSale.value
        ? this.getPrice()
        : 0;
      formData.imageUrl = this.imagePath;
      formData.collectionId = this.collectionId;
      formData.isMultiple = this.typeOfNft != 'single';
      formData.royalties = this.royalties;
      formData.blockchainId =  this.createNftForm.controls.blockchainId.value;
      
      this.openDialogSubmitNFT(formData);
    }
  }

  getPrice() {
    if (this.createNftForm.controls.typeOfSale.value == 1) {
      return this.createNftForm.controls.fixedPrice.value;
    } else if (this.createNftForm.controls.typeOfSale.value == 2) {
      return this.createNftForm.controls.minimunBid.value;
    }
    return 0;
  }

  openDialogCreateCollection(): void {
    const dialogRef = this.dialog.open(CreateCollectionComponent, {
      width: 'auto',
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getTokenId();
    });
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

    dialogRef.afterClosed().subscribe((result) => {
      this.submitted = false;
    });
  }

  clearForm() {
    this.imageUrl = '';
    this.createNftForm.reset();
  }
}
