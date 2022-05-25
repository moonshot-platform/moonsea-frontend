import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContractService } from 'src/app/services/contract.service';
import { GetDataService } from 'src/app/services/get-data.service';
import { TokenomicsService } from 'src/app/services/tokenomics.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  active = false;
  wallet = false;
  walletActive = '';
  userProfilePic: any;
  userAddress: any;
  userDetails: any;
  constructor(
    private tokenomicsService: TokenomicsService,
    public dialog: MatDialog,
    private getDataService: GetDataService,
    private cs: ContractService
  ) {}

  ngOnInit(): void {
    this.tokenomicsService.whenToggled().subscribe((state: boolean) => {
      this.toggleTokenomicsView(state);
    });

    this.cs.getWalletObs().subscribe((data: any) => {
      this.userAddress = data;
      this.fetchData();
    });

    this.cs.isAcountChangedSub.subscribe((res: any) => {
      this.fetchData();
    });
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

  @HostListener('document:click', ['$event'])
  onMouseEnter(event: any) {
    let moonSeaSidebar =
      document?.getElementById('moonsea-sidebar')?.contains(event.target) ??
      true;

    if (!moonSeaSidebar) {
      let tokenomicsSidebar = document
        ?.getElementById('tokenomics-sidebar')
        ?.contains(event.target);
      let ratesSidebar = document
        ?.getElementById('rates-sidebar')
        ?.contains(event.target);

      if (!tokenomicsSidebar && !ratesSidebar) {
        this.tokenomicsService.onToggle(false);
      }
    }
  }

  fetchData() {
    this.getDataService
      .getUserDetails(this.userAddress, null)
      .subscribe((response: any) => {
        this.userDetails = response.data[0];
        if (this.userDetails) {
          this.userProfilePic = this.userDetails.profilePic;
        }
      });
  }

  switchNetwork(){
    this.cs.switchNetwork('0x13881');
  }
}
