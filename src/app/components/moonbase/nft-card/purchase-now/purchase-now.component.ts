import { Component, OnInit, Input } from '@angular/core';
import { PurchaseNowModalComponent } from '../purchase-now-modal/purchase-now-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConnectWalletPopupComponent } from 'src/app/components/moonbase/connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { ContractService } from 'src/app/services/contract.service';
import { RemoveFromSaleComponent } from '../../details-pop-up/remove-from-sale/remove-from-sale.component';

@Component({
  selector: 'app-purchase-now',
  templateUrl: './purchase-now.component.html',
  styleUrls: ['./purchase-now.component.scss']
})
export class PurchaseNowComponent implements OnInit {
  @Input() items:any ;
  @Input() fromPage : number = 0;
  @Input() nftName:any;
  @Input() blockchainId : any;

  connectedAddress: any;
  constructor(public dialog: MatDialog,
    private contractService:ContractService) { 
    
    }

  ngOnInit(): void {
    
  
    this.items.nftName = this.nftName;
    this.items.blockchainId = this.blockchainId;
    
    this.contractService.getWalletObs().subscribe((data:any)=>
    {
      this.connectedAddress = data;
     
      
      // this.getCollectionList();
    });
  }

  openDialog(){
    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }
  
    
    this.dialog.open(PurchaseNowModalComponent, {
  
      data:this.items
      ,
      disableClose : true
    });
    return false;
  }

  removeFromSale(){
    if(!this.contractService.checkValidAddress(this.connectedAddress))
    {
        this.connectWallet();
        return false;
    }
    this.dialog.open(RemoveFromSaleComponent, {
  
      data:this.items
      ,
      disableClose : true
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
