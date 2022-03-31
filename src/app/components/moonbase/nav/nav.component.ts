import { ContractService } from './../../../services/contract.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { WindowRefService } from 'src/app/services/window-ref.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { environment } from 'src/environments/environment';
import { RegistrationFormComponent } from './registration-form/registration-form.component';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [
    { 
    provide: MatDialogRef,
    useValue: []
     }, 
    { 
    provide: MAT_DIALOG_DATA, 
    useValue: [] 
    }
    ]
})
export class NavComponent implements OnInit {


  subscription: Subscription | undefined
  addressConnected: string = "";
  isConnected: boolean = false;
  shortAddress: string = "";
  balanceInBNB: any;
  getUser: any;
  isRegisterPopup: boolean = false;
  submitted: boolean = false;
  invalidAddress: boolean = false;
  walletAddress: string = "";
  profilePic: any = "./../../../assets/img/profile.png";
  data: any;
  notifyCount: any;
  name: any;
  flag: boolean = true;
  searchResult: any;
  condition:any = false;
  dialogRef:any;
  constructor(private route: Router, private windowRef: WindowRefService, private cs: ContractService, private getDataService: GetDataService, private ngZone: NgZone, private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.cs.getWalletObs().subscribe((data: any) => {
     localStorage.setItem('address',data);
      
      try{
      if (data != undefined && this.cs.checkValidAddress(data)) {

        this.isConnected = true;
        this.walletAddress = data;
       this.shortAddress = this.walletAddress.substring(0, 4) + '...' + this.walletAddress.substring(28, 32);
        this.changeAccountDetected(data);
        this.getUserDetails();
      }
    }
    catch(e)
    {
      
    }
    });
    this.checkLoggedInUser();
  }



  condition_check(){

    if(!this.condition){
      this.condition = true
    }else{
      this.condition = false
    }


  }


  async checkLoggedInUser() {


    // this.walletAddress = await this.cs.checkLoggedInUser();

    this.getNotificationCount(this.walletAddress);
  }

  async getUserDetails() {
    setTimeout(async () => {
      this.ngZone.run(async () => {
        var balance = await this.cs.getBalance();
   //this.getDataService.getUser(this.addressConnected).then(result =>balance = getUser);
        this.subscription = this.getDataService.getUser(this.walletAddress).subscribe((response: any) => {
          if (response.isSuccess) {
           if(response.data){
            this.getUser = response.data;
            this.profilePic = response.data.profilePic ?? "./../../../assets/"+environment.defaultProfilePic;
            this.name = response.data.name ?? "Enrico Cole";
           }
          }
        })

        this.balanceInBNB = balance > 0 ? ((balance / 1e18).toFixed(4)) : 0;
      });
    }, 2000);
  }




  async changeAccountDetected(accounts: any) {



    // this.clickevnet()

    if (localStorage.getItem("isRegistered") || localStorage.getItem("isRegistered") == null || localStorage.getItem("isRegistered") == "false") {
      this.getDataService.checkIsRegister(
        accounts
      ).subscribe(
        response => {
          var data = response;
          
          if (data.isSuccess) {
            if (data.data.isNewUser) {
              this.showRegisterPopup();
            }
            else {
              this.hideRegisterPopup();
              if(this.dialogRef){
                this.dialogRef.close();
              }
             
              localStorage.setItem('isRegistered', "true");
              localStorage.setItem('userData',JSON.stringify(data.data));
            }
          }else{
            this.hideRegisterPopup();
          }
        });
    }
    //  location.href="/";
  }



  showRegisterPopup() {
    this.dialogRef = this.dialog.open(RegistrationFormComponent, {
      width: 'auto',
      disableClose: true,
      data: {
        walletAddress: this.walletAddress
      }
    });
  }

 



  searchClient(searchText: any) {

    this.flag = true;
   if(searchText.length > 3){
    this.getDataService.searchResult(
      searchText
    ).subscribe(
      response => {
        this.searchResult = response.data;

        // if(data.isSuccess)
        // {
        //   if(data.data.isNewUser)
        //   {
        //     this.showRegisterPopup();
        //   }
        //   else
        //   {
        //     this.hideRegisterPopup();
        //     localStorage.setItem('isRegistered',"true");
        //   }
        // }
      });
   }
  }

  onselectClient(enterText: any, serachType: any, nftToken: any) {
    this.flag = false;
    if (serachType == 1) {
      this.route.navigate(['details', nftToken]);
    }
    else if (serachType == 2) {
      this.route.navigate(['profile', enterText]);
    }
    else if (serachType == 4) {
      this.route.navigate(['profile', enterText]);
    }
    else {
      this.route.navigate(['collection', enterText]);
    }
    }


  Disconnect() {
    localStorage.clear();
    this.cs.setWalletObs(new Object());
    this.route.navigate(['']);
    this.getUser = '';
    this.notifyCount = ''
    this.isConnected = false;

  }

  hideRegisterPopup() {
    this.ngZone.run(() => {
      this.isRegisterPopup = false;
    });

   
  }








  async getNotificationList(address: string) {

    this.getDataService.notificationList(
      address
    ).subscribe((response: any) => {

      this.data = response.data;

    })

  }

  async getNotificationCount(address: string) {
    this.getDataService.notificationCount(
      address
    ).subscribe((response: any) => {

      this.notifyCount = response.data[0].notifyCount;

    })
  }

}
