import { ApplicationRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GetDataService } from 'src/app/services/get-data.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { HomeService } from 'src/app/services/home.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mycollections',
  templateUrl: './mycollections.component.html',
  styleUrls: ['./mycollections.component.scss'],
})
export class MycollectionsComponent implements OnInit, OnDestroy {
  tabIndex: any = 1;
  walletAddress:any="";
unSubscribeRequest:Subscription;
connectedAddress:any;
myCollection:any = [];
collectionName:any;
collectionId:any;
  constructor(
    private location: Location,
    private createNftService: CreateNftService,
    private route: Router,
    private _activatedroute: ActivatedRoute,
    private contract_service: ContractService,
    private appRef: ApplicationRef,
    private ngxLoader:NgxUiLoaderService,
    private getDataService:GetDataService,
    private homeService: HomeService,
    private _titleService : Title
  ) {
    // route.routeReuseStrategy.shouldReuseRoute = function () {
    //   return true;
    // };
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this._titleService.setTitle('My Collections');
    this.walletAddress = localStorage.getItem('address');

    this.createNftService.subject.subscribe((res: any) => {
      this.tabIndex = res.tabIndex;
      this.collectionName = res.collectionName;
      this.collectionId = res.collectionId;
     
    });

    this.contract_service.getWalletObs().subscribe((data: any) => {
      if(this.connectedAddress != data){
        this.connectedAddress = data;
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
    this.route.navigate(['/collection'], { relativeTo: this._activatedroute, queryParams: {}});
  }
  onTabChanged(index: any) {
  }

  
}
