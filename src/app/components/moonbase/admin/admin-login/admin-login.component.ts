import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { ConnectWalletPopupComponent } from '../../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  walletAddress :any;
  constructor(private _apiService:GetDataService,private contractService:ContractService,private matdialog:MatDialog,private toaster:ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.walletAddress = localStorage.getItem('address');
    this.contractService.getWalletObs().subscribe((data:any)=>{
       
      if(data != 'null'){
        this.walletAddress = data;
        if(parseInt(localStorage.getItem('wallet')) > 0){
          if(parseInt(localStorage.getItem('wallet')) == 1){
            this.contractService.connectAccountMetamask(1);
          }
          if(parseInt(localStorage.getItem('wallet')) == 2){
            this.contractService.connectAccountWalletConnect(2);
          }
        }
      }else{

      }
    })
  }


  async login(){
    if(this.walletAddress != "null" && this.walletAddress != undefined){
      let signature = await this.contractService.createSignature(`Admin is login. Walletaddress of admin is ${this.walletAddress}`);
      if(signature.status){
        this._apiService.postRequest('Admin/adminLogin',{walletAddress:this.walletAddress,signature:signature.signature}).subscribe({
          next:(res:any)=>{
            console.log(res);
            if(res.status == '200'){
              this.toaster.success(res.message);
              sessionStorage.setItem('isAdminLogin',"true");
              this.router.navigate(['/adminauthorization/home'])
            }else{
              sessionStorage.setItem('isAdminLogin',"false");
              this.toaster.error(res.message)
            }
          },
          error:(err:any)=>{
            console.log(err);
            
          }
        })
      }
      
    }else{
      console.log("ellse");
      const dialogRef = this.matdialog.open(ConnectWalletPopupComponent);
    }
  }
}
