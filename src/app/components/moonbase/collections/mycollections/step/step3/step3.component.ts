import {
  Component,
  OnInit,
  ViewChild,
  
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { AddEditNftComponent } from '../add-edit-nft/add-edit-nft.component';
import { Subscription } from 'rxjs/internal/Subscription';

declare var $: any;

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy {
  createNftForm: FormGroup;
  unSubscribeRequest: Subscription;

  @ViewChild('ejDatePicker') ejDatePicker: DatePickerComponent | undefined;
  public targetElement: HTMLElement | undefined;

  isUploadButtonDisabled: boolean = false;
  imageUrl: string =
    'https://moonboxes.io/assets/media/images/astro_painter.svg';
  typeOfNft: any;
  collectionId: any;
  nftList: any = [];
  collectionDetails: any = {};
  dialogRef: any;
  unSubscribeRequest01: Subscription;

  constructor(
    private route: Router,
    private _activatedRoute: ActivatedRoute,
    private createNFTService: CreateNftService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private _getDataService: CollectionApiService
  ) {
    this.typeOfNft = 'single';
  }
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if( this.unSubscribeRequest){
    this.unSubscribeRequest.unsubscribe();

    }
    if( this.unSubscribeRequest01){
    this.unSubscribeRequest01.unsubscribe();
      
      }

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._activatedRoute.queryParams.subscribe((res: any) => {
      this.collectionId = res.collectionId;
    });

    this.getNftList();
    this.getCollectionDetails();
  }

  getNftList() {
    let url =
      'api/getCollectionIdWiseNftList?collectionId=' + this.collectionId;
      this.unSubscribeRequest = this._getDataService.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.nftList = res.data;
        }
      },
      (err: any) => {}
    );
  }
  getCollectionDetails() {
    let url = 'api/getCollectionDetails?collectionId=' + this.collectionId;
    this.unSubscribeRequest01 =  this._getDataService.getRequest(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.collectionDetails = res.data;
          this.imageUrl = this.collectionDetails.fileUrl;
        }
      },
      (err: any) => {}
    );
  }

  edit(item: any) {
    item.collectionId = this.collectionId;
    this.dialogRef = this.dialog.open(AddEditNftComponent, {
      width: 'auto',
      data: item,
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      this.getNftList();
    });
  }
  gotoStep01() {
    this.createNFTService.subject.next({ tabIndex: 1 });
  }
  gotoProfile(walletAddress: any) {
    this.route.navigate(['/profileinfo/profile', walletAddress]);
  }
}
