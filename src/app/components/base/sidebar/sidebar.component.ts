import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenomicsService } from 'src/app/services/tokenomics.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  active = false;
  wallet = false;
  walletActive = '';
  useData: any = {};
  userProfilePic: any;

  constructor(
    private tokenomicsService: TokenomicsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.tokenomicsService.whenToggled().subscribe((state: boolean) => {
      this.toggleTokenomicsView(state);
    });

    this.useData = JSON.parse(localStorage.getItem('userData'));
    this.userProfilePic = this.useData.userInfo.profilePic;
  }

  toggleTokenomicsView(active: boolean = false, walletActive: string = '') {
    if (active) {
      if (walletActive == 'wallet') {
        this.wallet = false;
        this.active === true ? this.active = false : this.active = true;
      }
      if (walletActive == 'rates') {
        this.active = false;
        this.wallet === true ? this.wallet = false : this.wallet = true
      }
    }
    else {
      this.active = false;
      this.wallet = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onMouseEnter(event: any) {
    let moonSeaSidebar = document?.getElementById('moonsea-sidebar')?.contains(event.target) ?? true;

    if (!moonSeaSidebar) {
      let tokenomicsSidebar = document?.getElementById('tokenomics-sidebar')?.contains(event.target)
      let ratesSidebar = document?.getElementById('rates-sidebar')?.contains(event.target);

      if (!tokenomicsSidebar && !ratesSidebar) {
        this.tokenomicsService.onToggle(false);
      }

    }
  }

}
