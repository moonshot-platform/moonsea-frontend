import { Component, Input, OnInit } from '@angular/core';
import { NftInteractionService } from 'src/app/services/nft-interaction.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptBidPopupComponent } from './accept-bid-popup/accept-bid-popup.component';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})
export class BidsComponent implements OnInit {

  @Input() ID:any;
  @Input() items: any;
  @Input() nftAddress:any;
  data:any=[];
  totalCount :any = 0;
  loggedInUseAddress:any;
  isShowAcceptButtonForAll:boolean= false;
  constructor(private nftInteractionService:NftInteractionService,
    public dialog: MatDialog,
    private contractService : ContractService) { }

  ngOnInit(): void {
    this.loggedInUseAddress = localStorage.getItem('address');
    
    this.getInfo();
    
  }

  async getInfo()
  {
    this.nftInteractionService.getBidHistoryForNft(
      this.items.asset,
      this.ID,
      this.contractService.userAddress,
      this.nftAddress,this.items?.blockchainId
    ).subscribe((response:any)=>
    {
      this.data = response.data;
      this.totalCount = this.data.length;
    })
  }

  openDialog(index:any){
    //debugger
    const dialogRef = this.dialog.open(AcceptBidPopupComponent, {
   //   width: '250px',
      data:{
        data : this.data[index],
        nftId : this.ID,
        nftDetails : this.items
      },
      disableClose : true
    });
    
  }

}
