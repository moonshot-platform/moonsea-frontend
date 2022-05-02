import { Component, OnInit, ViewChild, NgZone, Inject, Input, OnDestroy } from '@angular/core';
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
import { ContractService } from 'src/app/services/contract.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { CreateCollectionComponent } from 'src/app/components/moonbase/create-nft/create-collection/create-collection.component';
import { ModalForCreateNftComponent } from 'src/app/components/moonbase/create-nft/modal-for-create-nft/modal-for-create-nft.component';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { AddEditNftComponent } from '../add-edit-nft/add-edit-nft.component';

declare var $: any;

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit ,OnDestroy{

  createNftForm: FormGroup;  


  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  isUploadButtonDisabled: boolean = false;
  imageUrl: string =
    'https://moonboxes.io/assets/media/images/astro_painter.svg'; 
  typeOfNft: any;
  collectionId :any;
  nftList:any = [];
  collectionDetails:any={};
  dialogRef :any ;


  constructor(
    private route: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private cs: ContractService,
    private createNFTService: CreateNftService,
    public datepipe: DatePipe,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private _getDataService : CollectionApiService,
  ) {
    this.typeOfNft = 'single';
  }
  ngOnDestroy(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._activatedRoute.queryParams.subscribe((res:any)=>{
        this.collectionId = res.collectionId;
    });

    this.getNftList();
    this.getCollectionDetails();
  }


  getNftList(){
    let url ="api/getCollectionIdWiseNftList?collectionId="+this.collectionId;
    this._getDataService.getRequest(url).subscribe((res:any)=>{
        if(res.status == 200){
          this.nftList = res.data;
        }
    },(err:any)=>{

    })
  }
  getCollectionDetails(){
    let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
    this._getDataService.getRequest(url).subscribe((res:any)=>{
      if(res.status == 200){
        this.collectionDetails = res.data;
        this.imageUrl = this.collectionDetails.fileUrl;
      }
  },(err:any)=>{

  })
  }
 

  edit(item:any){
    
    item.collectionId = this.collectionId;
     this.dialogRef = this.dialog.open(AddEditNftComponent, {
      width: 'auto',
      data: item,
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.getNftList();
    });
  }
  gotoStep01(){
    this.createNFTService.subject.next({ tabIndex: 1 });
  }
} 
