import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';

@Component({
  selector: 'app-connect-wallet-popup',
  templateUrl: './connect-wallet-popup.component.html',
  styleUrls: ['./connect-wallet-popup.component.scss']
})
export class ConnectWalletPopupComponent implements OnInit {
  web3Provider:any;
  private _account: unknown;
  addressConnected: string="";
  isConnected : boolean = false;

  constructor(private contractService:ContractService,public dialogRef: MatDialogRef<ConnectWalletPopupComponent>,
    private getDataService: GetDataService) { }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

  async connectMetamask()
  {
    await this.contractService.connectAccountMetamask(1);
    this.getAccount();
    this.getDataService.profilePic.next(1);
  }

  async connectBinanceChain()
  {
    console.log("wall")
    await this.contractService.connectAccountWalletConnect(1);
    this.getAccount();
  }


  async getAccount(){
    if(localStorage.getItem('address')!==undefined && localStorage.getItem('address')!==null && localStorage.getItem('address'))
    {
      this.addressConnected=localStorage.getItem('address') ?? "";
      this.isConnected=true;
      this.close();
    }
    else{
      this.isConnected=false;
    }
  }

  coinBase(){
    // alert('dj')
    // this.contractService.intializeCoinbase();
  }

  close(): void {
    this.dialogRef.close();
  }

}


