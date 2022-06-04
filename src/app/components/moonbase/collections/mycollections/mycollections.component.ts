import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss'],
})
export class MycollectionsComponent implements OnInit, OnDestroy {
  tabIndex: any = 1;
  walletAddress:any="";

  constructor(
    private location: Location,
    private createNftService: CreateNftService,
    private route: Router,
    private _activatedroute: ActivatedRoute,
    private contract_service: ContractService,
    private appRef: ApplicationRef
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.walletAddress = localStorage.getItem('address');

    this.createNftService.subject.subscribe((res: any) => {
      this.tabIndex = res.tabIndex;
    });

    this.contract_service.getWalletObs().subscribe((data: any) => {
      if(this.walletAddress == data){
        
      }else{
        this.tabIndex = 1;
      }
    });
  }




  isSelected(index: number) {
    if (this.tabIndex == index) {
      return false;
    } else {
      return true;
    }
  }

  gotoback() {
    this.tabIndex = 0;
    this.route.navigate(['/mycollection'], { relativeTo: this._activatedroute, queryParams: {}});
  }
  onTabChanged(index: any) {
  }
}
