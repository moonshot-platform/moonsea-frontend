
import { Component, OnInit,Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import { AddInListingComponent } from './add-in-listing/add-in-listing.component';
import { BurnTokenComponent } from './burn-token/burn-token.component';
import { ChangePriceComponent } from './change-price/change-price.component';
import { RemoveFromSaleComponent } from './remove-from-sale/remove-from-sale.component';
import { ReportComponent } from './report/report.component';
import { TransferTokenComponent } from './transfer-token/transfer-token.component';

@Component({
  selector: 'app-details-pop-up',
  templateUrl: './details-pop-up.component.html',
  styleUrls: ['./details-pop-up.component.scss']
})
export class DetailsPopUpComponent implements OnInit {

  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DetailsPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private getDataservice : GetDataService) { }

  ngOnInit(): void {
    this.getDataservice.subjectTo.subscribe(
      (res)=>{
        if(res.resell){
          this.data.isListed = 0;
        }
        if(res.addlisting){
          this.data.isListed = 1;
        }
      }
    )
  }
  onNoClick(): void {
    
    this.dialogRef.close();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePriceComponent, {
      width: 'auto',
      data: this.data
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  openDialogBurn(): void {
    const dialogRef = this.dialog.open(BurnTokenComponent, {
      width: 'auto',
      data: {
        ID:this.data.ID,
        isMultiple : this.data.isMultiple
      }
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  openDialogRemove(): void
  {
    const dialogRef = this.dialog.open(RemoveFromSaleComponent, {
      width: 'auto',
      data: this.data
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  openDialogAddListing(): void
  {  
  
    const dialogRef = this.dialog.open(AddInListingComponent, {
      width: 'auto',
      panelClass: 'listingBig',
      data: {
        ID:this.data.ID,
        nftTokenId : this.data.nftTokenID,
       price : this.data.price,
       supply : this.data.currentSupply,
       nftAddress : this.data.nftAddress,
       isMultiple : this.data.isMultiple,
       collectionId : this.data.collectionId,
       blockchainId : this.data.blockchainId,
       royalties:this.data.royalties,
       royaltiesOwner :this.data.royaltiesOwner
      }
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  openDialogReport() : void
  {
    const dialogRef = this.dialog.open(ReportComponent, {
      width: 'auto',
      data: {
        ID:this.data.ID
      }
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  openDialogTransfer() : void
  {
    const dialogRef = this.dialog.open(TransferTokenComponent, {
      width: 'auto',
      data: {
        ID:this.data.ID,
        currentSupply : this.data.currentSupply,
        isMultiple : this.data.isMultiple,
        nftAddress : this.data.nftAddress
      }
    });

    
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  close(): void {
    this.dialogRef.close();
  }

} 
