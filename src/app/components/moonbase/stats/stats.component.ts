import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { HomeService } from 'src/app/services/home.service';
import { TopCollectionListComponent } from '../stats-m/top-collection-list/top-collection-list.component';
import { LineChartsComponent } from './line-charts/line-charts.component';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  getStatsList: any;
  StatsList: any;
  blockchainList :any = [];
  blockchainId :any =1;

  constructor(private homeService: HomeService, public dialog: MatDialog,
          private router:Router,private createNFT: CreateNftService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.StatList();
    this.getBlockchainList(); 
  }

  async StatList() {
    this.homeService.getStats(this.blockchainId).subscribe((response: any) => {
      this.getStatsList = response.data.GlobalData;
      this.StatsList = response.data;
    });
  }
  openChart() {
    const dialogRef = this.dialog.open(LineChartsComponent,{width:'100%'});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getBlockchainList() {
    this.createNFT.getBlockchainList().subscribe((response: any) => {
      this.blockchainList = response.data;
      // this.currencySymbol = this.blockchainList[0].networkName;
      // this.blockchainId = this.blockchainList[0].blockchainId;
    });
  }
  selectBlockchain(blockchainId:any){
    this.StatList();
  }
}
