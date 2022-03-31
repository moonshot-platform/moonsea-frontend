import { Component, OnInit } from '@angular/core';
import { TokenomicsService } from 'src/app/services/tokenomics.service';
import { ContractService } from 'src/app/services/contract.service';
import { MatDialog } from '@angular/material/dialog';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';

@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss']
})
export class WalletConnectComponent implements OnInit {
  connectedAddress="";
  isConnected=false;
  userBalance=0;
  netWorkId = 0;
  BlockchainNames = {
    0 : "BNB",
    56 : "BNB",
    97 : "BNB",
    1 : "ETH",
  }
  constructor( private tokenomicsService: TokenomicsService,private contractService:ContractService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.contractService.getWalletObs().subscribe((data:any)=>
    {
      this.isConnected = this.contractService.checkValidAddress(data);
      if(this.isConnected){
      this.connectedAddress = data;
      this.getUserBalance();
      } 
    });
    
  }

  async getUserBalance()
  {
    this.netWorkId =await this.contractService.getConnectedNetworkId();
    this.userBalance = await this.contractService.getBalance();
  }

  toggleTokenomics(): void {
    
    this.tokenomicsService.onToggle(false);
  }

  Disconnect() {
    localStorage.clear();
    this.contractService.setWalletObs(new Object());
    location.reload();

  }

  connectwallet() {
    const dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
      width: 'auto',
    });
  }

}
