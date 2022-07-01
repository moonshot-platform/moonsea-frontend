import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CollectionApiService } from 'src/app/services/collection-api.service';
import { CreateNftService } from 'src/app/services/create-nft.service';
import { HomeService } from 'src/app/services/home.service';
import { TopCollectionListComponent } from '../stats-m/top-collection-list/top-collection-list.component';
import { LineChartsComponent } from './line-charts/line-charts.component';

import blockjson from '../../../../assets/blockchainjson/blockchain.json';
import { PricingApiService } from 'src/app/services/pricing-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  getStatsList: any;
  StatsList: any =[];
  blockchainList :any = [];
  blockchainId :any =1;
  searchKey: any = 'all collections';
  collectionlist: any = [];
  pageNo: any = 1;
  PageSize: any = 12;
  categoryId:any;
  isShowLoader: boolean = false;
  currencySymbol :any ='';
  chartData: any = [];
  data01 :any = [];
  blockchainInfo :any ={};
  globalstatDetails :any ={};
  getCryptoPrice :any = {};

  constructor(private homeService: HomeService, public dialog: MatDialog,
          private router:Router,private createNFT: CreateNftService,
          private ngxService: NgxUiLoaderService,
          private dataservice: CollectionApiService,
          private pricingApi :PricingApiService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.StatList();
    this.getBlockchainList(); 

    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.blockchainId){
        this.blockchainInfo = element;
      }
    });
    this.getPriceForBNB();

    let that = this;
    window.onclick = function (event) {
      if (
        !event.target.matches('.dropdown *') ||
        event.target.matches('.dropdown-content *')
      ) {
        that.outsideClick();
      }
    };
    this.getGlobalstat();
  }

  outsideClick() {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  async StatList() {
    if(this.searchKey.toLowerCase() == 'all collections'){
      this.homeService.getStats(this.blockchainId,'',this.pageNo,this.PageSize).subscribe((response: any) => {
        this.getStatsList = response.data.GlobalData;
        response.data.forEach(element => {
          this.StatsList.push(element)
        });
    });
    }else{
    this.homeService.getStats(this.blockchainId,this.searchKey,this.pageNo,this.PageSize).subscribe((response: any) => {
      this.getStatsList = response.data.GlobalData;
      response.data.forEach(element => {
        this.StatsList.push(element)
      });
    });
  }
  }

  getSaleChart(collectionId:any) {
   let promise = new Promise ((resolve,reject)=>{
    let url =`api/getSaleChart?collectionId=${collectionId}`;
    this.dataservice.getTemparory(url).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.chartData = res.data;

          for (let i = 0; i < this.chartData.length; i++) {
            this.data01.push([
              this.chartData[i].dateTime,
              this.chartData[i].AveragePrice,
              this.chartData[i].Sales,
            ]);
          }
          resolve(this.data01);
        } else {
        }
      },
      (err) => {
        console.log(err);
        reject(err);
      }
    );
   });

   return promise;
  }


  async openChart(collectionId:any) {
    let lineChartData = [];
   await this.getSaleChart(collectionId).then((res:any)=>{
      lineChartData = res;
    })

    const dialogRef = this.dialog.open(LineChartsComponent,{width:'100%',data:{arr:lineChartData}});

    dialogRef.afterClosed().subscribe((result) => {
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
    blockjson[environment.configFile].forEach(element => {
      if(element.blockchainId ==  this.blockchainId){
        this.blockchainInfo = element;
      }
    });
    this.StatsList = [];
    this.StatList();
    this.getPriceForBNB();
  }


  getPriceForBNB(){
    let coinName :any;
    if(this.blockchainInfo.name.toLowerCase() == 'binance'){
      coinName = 'binancecoin';
    }else if(this.blockchainInfo.name.toLowerCase() == 'polygon'){
      coinName = 'matic-network';
    }
    else{
      coinName = this.blockchainInfo.name.toLowerCase();
    }
    this.pricingApi.getPriceForBNB(coinName).subscribe((res:any)=>{
      if(coinName == 'binancecoin'){
        this.getCryptoPrice = res.binancecoin;
      }
      if(coinName.toLowerCase() == 'ethereum'){
        this.getCryptoPrice = res.ethereum;
      }
      if(coinName.toLowerCase() == 'matic-network'){
        this.getCryptoPrice = res[coinName];
      }
      
    })
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
    this.outsideClick();
    document.getElementById('myDropdown').classList.toggle('show');
  }

 


   getGlobalstat(){
    let url = `api/getStatGlobal?blockchainId=${this.blockchainId}`;
    this.dataservice.getRequest(url).subscribe((res:any)=>{
      if(res.isSuccess){
        this.globalstatDetails = res.data;
      }
    },(err:any)=>{

    })
   }

   loadmore(){
    this.pageNo = this.pageNo +1;
    this.StatList();
   }
}
