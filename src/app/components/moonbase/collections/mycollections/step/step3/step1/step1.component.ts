import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { ConnectWalletPopupComponent } from 'src/app/components/moonbase/connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit,OnDestroy {

// @Input() myCollection: any =[];
myCollection: any =[];
connectedAddress: any;
unSubscribeRequest:Subscription;
signature :any;

constructor(private route:Router,
  private location: Location,
  public dialog: MatDialog,
  private toastr: ToastrService,
  private homeService: HomeService,
  private cs: ContractService,
  private _activatedRoute: ActivatedRoute,
  private ngxLoader:NgxUiLoaderService,
  private getDataService:GetDataService) { }
  ngOnDestroy(): void {
    if(this.unSubscribeRequest){
      this.unSubscribeRequest.unsubscribe();
    }
    
  }

ngOnInit(): void {
  
  this.cs.getWalletObs().subscribe((data: any) => {
    if(this.connectedAddress != data){
      this.connectedAddress = data;
      this.getmyCollectionList();
    }
  });

 

  this.signature = sessionStorage.getItem('createCollectionSignature');

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

  async openDialogCreateCollection(): Promise<void> {
  
    if(!this.cs.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return ;
    }
    var status:any= await this.cs.signMsgForCreateCollection();
    sessionStorage.setItem('createCollectionSignature',status.signature);
    if(status.status){
      const dialogRef = this.dialog.open(CreateCollectionComponent, {
        width: 'auto',
        data: {
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      
      });
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
    this.toastr.error("please connect the wallet");
  }
 
}

  async getmyCollectionList() {
    this.myCollection = [];
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
            response.data[i].asset =
            response.data[i].nftDetailsList[0].asset;
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





  async edit(item:any){
    let dialogRef :any;
    if(this.signature){
       dialogRef = this.dialog.open(CreateCollectionComponent, {
        width: 'auto',
        data:{collectionId:item.collectionId},
        disableClose:true
      });
    }else{
      var status:any= await this.cs.signMsgForCreateCollection();
      sessionStorage.setItem('createCollectionSignature',status.signature);
      if(status.status ){
       dialogRef = this.dialog.open(CreateCollectionComponent, {
        width: 'auto',
        data:{collectionId:item.collectionId},
        disableClose:true
      });
      
      }
    }

    dialogRef.afterClosed().subscribe(result => {
      
    });

}


importcollection() {
  const dialogRef = this.dialog.open(ImportCollectionComponent, {
    width: 'auto',
  });
}



connectWallet()
{
  this.dialog.open(ConnectWalletPopupComponent, {
    height: 'auto',
    width: 'auto',
  });
}
}

