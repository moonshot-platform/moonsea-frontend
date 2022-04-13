import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CollectionApiService } from 'src/app/services/collection-api.service';
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
  searchKey: any = 'all collections';
  collectionlist: any = [];
  pageNo: any = 0;
  PageSize: any = 9;
  categoryId:any;
  isShowLoader: boolean = false;
  currencySymbol :any ='';

  constructor(private homeService: HomeService, public dialog: MatDialog,
          private router:Router,private createNFT: CreateNftService,
          private ngxService: NgxUiLoaderService,
          private dataservice: CollectionApiService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.StatList();
    this.getBlockchainList(); 

    window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    };

  }

  async StatList() {
    if(this.searchKey.toLowerCase() == 'all collections'){
      this.homeService.getStats(this.blockchainId,'').subscribe((response: any) => {
        this.getStatsList = response.data.GlobalData;
        this.StatsList = response.data;
      });
    }else{

   
    this.homeService.getStats(this.blockchainId,this.searchKey).subscribe((response: any) => {
      this.getStatsList = response.data.GlobalData;
      this.StatsList = response.data;
    });
  }
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
      this.currencySymbol = this.blockchainList[0].networkName;
      this.blockchainId = this.blockchainList[0].blockchainId;
    });
  }
  
  selectBlockchain(blockchainId:any,networkName:any){
    this.blockchainId = blockchainId;
    this.currencySymbol  = networkName;
    this.StatList();
  }

  searchClient(searchKey:any){
    this.searchKey = searchKey;
    this.collectionlist = [];
    // this.getListofCollection()
    this.StatList();
  }

  clearSearch(){
    this.searchKey = 'all collections';
    document.getElementById("textSearch").innerHTML = "all collections";
    this.StatList();
  }

  getListofCollection() {
    this.isShowLoader = true;
    this.ngxService.start();
    let url ="home/getCollectionListAll?pageNo="+this.pageNo+"&PageSize="+this.PageSize+"&searchText="+this.searchKey+"&blockchainId="+this.blockchainId+"&categoryId="+this.categoryId;

    this.dataservice.getRequest(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
         
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
              response.data[i].nftFileUrl01 =
                response.data[i].nftDetailsList[0].nftFileUrl;
              response.data[i].nftTokenID01 =
                response.data[i].nftDetailsList[0].nftTokenID;
              response.data[i].nftAddress =
                response.data[i].nftDetailsList[0].nftAddress;
            }
          }
          // this.collectionlist = response.data;
          // this.collectionlist.push(response.data)
          response.data.forEach(element => {
              this.collectionlist.push(element)
          });
          // console.log("!!!!!!=>",this.collectionlist);
          
          this.ngxService.stop();
          this.isShowLoader = false;
        } else {
          this.ngxService.stop();
        }
      },
      (err: any) => {
        console.log(err);
        this.ngxService.stop();
      }
    );
  }

  myFunction() {
    document.getElementById('myDropdown').classList.toggle('show');
  }

  getListofCollection01(blockchainId:any,currencySymbol:any){
    this.blockchainId = blockchainId;
    this.currencySymbol = currencySymbol;
    this.collectionlist = [];
     this.getListofCollection();
   }

}
