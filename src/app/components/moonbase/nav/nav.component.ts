import { ContractService } from './../../../services/contract.service';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { WindowRefService } from 'src/app/services/window-ref.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { environment } from 'src/environments/environment';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { WalletConnectComponent } from '../wallet-connect/wallet-connect.component';
import { TokenomicsService } from 'src/app/services/tokenomics.service';
import { ConnectWalletPopupComponent } from '../connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [
    {
      provide: MatDialogRef,
      useValue: [],
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: [],
    },
  ],
})
export class NavComponent implements OnInit {
  @ViewChild('searchText') searchInput: ElementRef;

  uniquedata: any = [];
  properties: any = [];
  subscription: Subscription | undefined;
  addressConnected: string = '';
  isConnected: boolean = false;
  shortAddress: string = '';
  balanceInBNB: any;
  getUser: any;
  isRegisterPopup: boolean = false;
  submitted: boolean = false;
  invalidAddress: boolean = false;
  walletAddress: string = '';
  profilePic: any = './../../../assets/img/profile.png';
  data: any;
  notifyCount: any;
  name: any;
  flag: boolean = true;
  searchResult: any;
  condition: any = false;
  dialogRef: any;
  menuItem = false;
  search = false;
  useData: any = {};
  userProfilePic: any;
  active = false;
  wallet = false;
  activeWallet: boolean = false;
  userBalance = 0;
  connectedAddress = '';
  BlockchainNames = {
    0: 'BNB',
    56: 'BNB',
    97: 'BNB',
    1: 'ETH',
  };
  netWorkId = 0;

  constructor(
    private route: Router,
    private windowRef: WindowRefService,
    private cs: ContractService,
    private getDataService: GetDataService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private tokenomicsService: TokenomicsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cs.getWalletObs().subscribe((data: any) => {
      
      this.isConnected = this.cs.checkValidAddress(data);
      if (this.isConnected) {
        this.connectedAddress = data;
        this.getUserBalance();
      }
    });

    

    let that = this;

    window.onclick = function (event) {
      let search = !event.target.matches('#searchBox');
      if (search) {
        that.flag = false;
      }
      that.flag = false;
    };

    this.cs.getWalletObs().subscribe((data: any) => {
      localStorage.setItem('address', data);

      try {
        if (data != undefined && this.cs.checkValidAddress(data)) {
          this.isConnected = true;
          this.walletAddress = data;
          this.shortAddress =
            this.walletAddress.substring(0, 4) +
            '...' +
            this.walletAddress.substring(28, 32);
          this.changeAccountDetected(data);
          this.getUserDetails();
        }
      } catch (e) {}
    });
    this.checkLoggedInUser();

    this.tokenomicsService.whenToggled().subscribe((state: boolean) => {
      this.toggleTokenomicsView(state);
    });
  }

  async getUserBalance() {
    
    try {
      this.userBalance = await this.cs.getBalance();
      this.netWorkId = await this.cs.getConnectedNetworkId();
    
    } catch (error) {
      
    }
    
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.flag = false;
    this.searchInput.nativeElement.value = '';
  }

  toggleTokenomicsView(active: boolean = false, walletActive: string = '') {
    if (active) {
      if (walletActive == 'wallet') {
        this.wallet = false;
        this.active === true ? (this.active = false) : (this.active = true);
      }
      if (walletActive == 'rates') {
        this.active = false;
        this.wallet === true ? (this.wallet = false) : (this.wallet = true);
      }
    } else {
      this.active = false;
      this.wallet = false;
    }
  }

  condition_check() {
    if (!this.condition) {
      this.condition = true;
    } else {
      this.condition = false;
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
        this.subscription = this.getDataService
          .getUser(this.walletAddress)
          .subscribe((response: any) => {
            if (response.isSuccess) {
              if (response.data) {
                this.getUser = response.data;
                this.profilePic =
                  response.data.profilePic ??
                  './../../../assets/' + environment.defaultProfilePic;
                this.name = response.data.name ?? 'Enrico Cole';
              }
            }
          });

        this.balanceInBNB = balance > 0 ? (balance / 1e18).toFixed(4) : 0;
      });
    }, 2000);
  }

  ////////////////////code commented for some time dont delete it ////////////////////////////////////////
  async changeAccountDetected(accounts: any) {

    if (localStorage.getItem("isRegistered") || localStorage.getItem("isRegistered") == null || localStorage.getItem("isRegistered") == "false") {
      this.getDataService.checkIsRegister(
        accounts
      ).subscribe(
        async response => {
          var data = response;
          debugger
          if (data.isSuccess) {
            if (data.isNewUser) {
              // this.showRegisterPopup();
              var signature = await this.cs.signMsgForRegister( this.walletAddress);
              if(signature){
                this.getDataService.registerUser({walletAddress:this.walletAddress,
                  referralAddress:'',signature:signature})
                .subscribe(
                  response => {
                    var data=response;
                    if(data.isSuccess)
                    {
                      this.toastr.success(data.message);
                      localStorage.setItem('isRegistered',"true");
                      window.location.reload();
                      
                    }
                    else
                    {
                      this.toastr.error(data.message);
                    }
                  });
                }
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
  }

  showRegisterPopup() {
    this.dialogRef = this.dialog.open(RegistrationFormComponent, {
      width: 'auto',
      disableClose: true,
      data: {
        walletAddress: this.walletAddress,
      },
    });
  }

  searchClient(searchText: any) {
    //   this.flag = true;
    //  if(searchText.length > 3){
    //   this.getDataService.searchResult(
    //     searchText
    //   ).subscribe(
    //     response => {
    //       this.searchResult = response.data;
    //     });
    //  }
    this.route.navigate(['/searchcollection'], {
      queryParams: { searchKey: searchText },
    });
  }

  onselectClient(
    enterText: any,
    serachType: any,
    nftToken: any,
    nftAddress: any
  ) {
    if (serachType == 1) {
      this.route.navigate(['/detailsCom/details', nftAddress, nftToken]);
    } else if (serachType == 2) {
      this.route.navigate(['/profileinfo/profile', enterText]);
    } else if (serachType == 4) {
      this.route.navigate(['/profileinfo/profile', enterText]);
    } else {
      this.route.navigate(['/mycollection/collection', enterText]);
    }
  }

  Disconnect() {
    localStorage.clear();
    this.cs.setWalletObs(new Object());
    this.route.navigate(['']);
    this.getUser = '';
    this.notifyCount = '';
    this.isConnected = false;
  }

  hideRegisterPopup() {
    this.ngZone.run(() => {
      this.isRegisterPopup = false;
    });
  }

  async getNotificationList(address: string) {
    this.getDataService.notificationList(address).subscribe((response: any) => {
      this.data = response.data;
    });
  }

  async getNotificationCount(address: string) {
    this.getDataService
      .notificationCount(address)
      .subscribe((response: any) => {
        this.notifyCount = response.data[0].notifyCount;
      });
  }

  arraymove(arr, fromIndex, toIndex) {
    let prmise = new Promise((resolve, rejects) => {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      resolve('a');
    });

    return prmise;
  }

  autoComplete(searchText) {
    this.uniquedata = [];
    this.properties = [];
    if (searchText.length > 2) {
      this.getDataService
        .searchResult(searchText)
        .subscribe(async (response) => {
          if (response.isSuccess) {
            this.flag = true;
            this.searchResult = response.data;
            this.searchResult.forEach((element) => {
              if (this.uniquedata.indexOf(element.serachType) === -1) {
                this.uniquedata.push(element.serachType);
              }
            });

            await this.arraymove(this.uniquedata, 2, 1);

            this.uniquedata.forEach((element: any, index: any) => {
              this.properties[index] = [];
              this.searchResult.forEach((el: any) => {
                if (el.serachType == element) {
                  this.properties[index].push(el);
                }
              });
            });
            console.log(this.uniquedata);
            console.log(this.properties);
          } else {
            this.flag = false;
          }
        });
    } else {
      this.flag = false;
    }
  }

  menuopen() {
    this.activeWallet = false;
    this.menuItem = true;
  }
  walletOpen() {
    this.activeWallet = true;
  }

  searchCollection() {
    this.search = true;
  }
  back() {
    this.search = false;
  }

  closeMenu() {
    this.activeWallet = false;
    this.menuItem = false;
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(WalletConnectComponent, {
      width: 'auto',
      backdropClass: 'popupBackdropClass',
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  connectwallet() {
    const dialogRef = this.dialog.open(ConnectWalletPopupComponent, {
      width: 'auto',
    });
  }
}
