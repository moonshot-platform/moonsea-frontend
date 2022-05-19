import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from 'src/app/services/home.service';
import { ContractService } from 'src/app/services/contract.service';
import { CreateCollectionComponent } from 'src/app/components/moonbase/create-nft/create-collection/create-collection.component';
import { ImportCollectionComponent } from '../../../import-collection/import-collection.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit,OnDestroy {

myCollection: any =[];
connectedAddress: any;
unSubscribeRequest:Subscription;

constructor(private route:Router,
  private location: Location,
  public dialog: MatDialog,
  private toastr: ToastrService,
  private homeService: HomeService,
  private cs: ContractService,
  private _activatedRoute: ActivatedRoute,
  private ngxLoader:NgxUiLoaderService) { }
  ngOnDestroy(): void {
    if(this.unSubscribeRequest){
      this.unSubscribeRequest.unsubscribe();
    }
    
  }

ngOnInit(): void {
  
  this.cs.getWalletObs().subscribe((data: any) => {
    this.connectedAddress = data;
    this.getmyCollectionList();

  });


  this.route.navigate(['.'], { relativeTo: this._activatedRoute, queryParams: {}});
}

createSignleNFT()
{
  this.route.navigate(['createNft/type','single']);
}

createMultipleNFT()
{
  this.route.navigate(['createNft/type','multiple']);
}

goBack(): void {
  this.location.back();
}

openDialogCreateCollection(): void {
  let isWalletConnected ;
  isWalletConnected  =  localStorage.getItem('wallet')
  if( isWalletConnected == 1){
    const dialogRef = this.dialog.open(CreateCollectionComponent, {
      width: 'auto',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }else{
    this.toastr.error("please connect the wallet...");
  }
 
}

openDialogImportCollection(): void {
  let isWalletConnected ;
  isWalletConnected  =  localStorage.getItem('wallet')
  if( isWalletConnected == 1){
    const dialogRef = this.dialog.open(ImportCollectionComponent, {
      width: 'auto',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }else{
    this.toastr.error("please connect the wallet...");
  }
 
}

getmyCollectionList() {
  this.ngxLoader.start();
  this.unSubscribeRequest = this.homeService.myCollectionList(this.connectedAddress).subscribe((response: any) => {
    if(response.status == 200){
      for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
          response.data[i].nftFileUrl01 =
            response.data[i].nftDetailsList[0].nftFileUrl;
          response.data[i].nftTokenID01 =
            response.data[i].nftDetailsList[0].nftTokenID;
          response.data[i].nftAddress =
            response.data[i].nftDetailsList[0].nftAddress;
        }
      }

      this.myCollection = response.data;
      this.ngxLoader.stop();
    }else{
      this.ngxLoader.stop();
    }
   
  },(err:any)=>{
    this.ngxLoader.stop();
  });
}

edit(item:any){
 
  const dialogRef = this.dialog.open(CreateCollectionComponent, {
    width: 'auto',
    data:{collectionId:item.collectionId},
    disableClose:true
  });
  dialogRef.afterClosed().subscribe(result => {
  
  });
}


importcollection() {
  const dialogRef = this.dialog.open(ImportCollectionComponent, {
    width: 'auto',
  });
}

}

