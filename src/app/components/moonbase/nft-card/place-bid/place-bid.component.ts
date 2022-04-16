import { Component, OnInit, Input } from '@angular/core';
import { PlaceBidModalComponent } from '../place-bid-modal/place-bid-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { ContractService } from 'src/app/services/contract.service';
import { ConnectWalletPopupComponent } from '../../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';

@Component({
  selector: 'app-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.scss']
})
export class PlaceBidComponent implements OnInit {

  @Input() items:any;
  @Input() nftName:any;
  @Input() fromPage=0;
  @Input() blockchainId=1;
  connectedAddress: any;

  constructor(public dialog: MatDialog,private contractService:ContractService) { }

  ngOnInit(): void {
   
    
    this.items.nftName = this.nftName;
    this.items.blockchainId = this.blockchainId;
    this.contractService.getWalletObs().subscribe((data:any)=>
    {
      this.connectedAddress = data;
    });
  }

  openDialog(){
  
    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }
    debugger
    this.dialog.open(PlaceBidModalComponent, {
      width: 'auto',
      data: this.items
    });
    return false;
  }

  connectWallet()
{
  this.dialog.open(ConnectWalletPopupComponent, {
    height: 'auto',
    width: 'auto',
  });
}

  

}
