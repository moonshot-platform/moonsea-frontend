import { AfterViewInit, Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { HomeService } from 'src/app/services/home.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { GetDataService } from 'src/app/services/get-data.service';
import blockjson from '../../../../assets/blockchainjson/blockchain.json';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss']
})
export class NftCardComponent implements OnInit {

  @Input() items:any;
  @Input() index:any;
  @Output() newItemEvent = new EventEmitter<string>();
  balanceInBNB:  string="";
  price:Number=0;
  Waddress: any ="";
  hotCollectionList:any;
  getTopSellerCreatorsList:any;
  connectedAddress:any;
  hotBidList: any;
  loading:boolean= false;
  isImageLoaded:any=[];
  blockchainInfo:any ={};
  constructor(private contractService:ContractService,
    private http:HttpClient,
    private toastrService:ToastrService,
    public dialog: MatDialog,
    private getDataService:GetDataService,
    private router:Router) { }

  ngOnInit(): void {
    
    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.items.blockchainId){
        this.blockchainInfo = element;
      }
    });
    this.defaltProfile()
    this.contractService.getWalletObs().subscribe((data:any)=>
    {
      this.connectedAddress = data;
      // this.getCollectionList();
    });
   }

 addNewItem(value:any) {
    this.newItemEvent.emit(value);
  }

  defaltProfile(){

    if(this.items.fileUrl == undefined ||this.items.fileUrl == null ){
      this.items.fileUrl = './../../../assets/img/icons8-male-user-80.png'
    }
  }

  async Liked(nftId:any)
  {

    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }
    var status:any= await this.contractService.signMsgForLiked(nftId);
    if(status.status ){
    //debugger
    this.getDataService.likedNft(
    {
     nftId : nftId,
     walletAddress : localStorage.getItem('address'),
     signature : status.signature,
     nftAddress:this.items.nftAddress,
     blockchainId:this.items.blockchainId,
     asset:this.items.asset
    }
    ).subscribe
    ((result:any)=>{

      if(result.data){
        this.items.isLikeByYou = 1;
        
      this.toastrService.success(result.message)
      console.warn(this.items.isLikeByYou);
      }
      else{
   
         this.toastrService.error(result.message)
      }

    })
  }
  else
  {
    this.toastrService.error("Something went wrong..");
  }

return false;
  }

  async UnLiked(nftId:any)
  {
    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }

    var status:any= await this.contractService.signMsgForUnLiked(nftId);

    if(status.status){
   if(status.signature){
    this.getDataService.unlikeNft(
    {
     id : nftId,
     walletAddress : localStorage.getItem('address'),
     signature : status.signature,
    asset:this.items.asset
    }
    ).subscribe
    ((result:any)=>{
     
      
      if(result.data){
        this.items.isLikeByYou = 0;
      this.toastrService.success(result.message)

      this.items.isLikeByYou = 0;

      }
      else{

      }


    })
   }
  }
   return false;
}


connectWallet()
{
  let dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
    height: 'auto',
    width: 'auto',
  });
}

gotoDetails(id:any){
  this.router.navigate(['/details',this.items.nftAddress,id,this.items.blockchainId ]);
}

onMediaLoad(event:any,indexx:any){
  
  
  if (event && event.target) {
    // debugger
    this.isImageLoaded[indexx] = true;
  } else {
    this.isImageLoaded[indexx] = false;
  }
}
}
