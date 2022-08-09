import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GetDataService } from 'src/app/services/get-data.service';
import { TokenomicsService } from 'src/app/services/tokenomics.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {
  public isOldPancakeRouter = true;

  data: any;
  
  public list: any = [
    [
      {
        key: "total supply:",
        val: "1,000,000,000,000,000",
        shortVal: "(1 quadrillion)"
      },
      {
        key: "circulating supply:",
        val: "---",
        shortVal: ""
      },
      {
        key: "burned forever:",
        val: "---",
        shortVal: ""
      },
    ],
    [
      {
        key: "moonshot for 1 bnb:",
        val: "---",
        shortVal: ""
      },
      {
        key: "market cap:",
        val: "---",
        shortVal: ""
      },
      {
        key: "price for 1 million moonshot:",
        val: "---",
        shortVal: ""
      },
      {
        key: "price for 1 moonshot:",
        val: "---",
        shortVal: ""
      }
    ]
  ]

  constructor( private tokenomicsService: TokenomicsService ,
              private getDataService : GetDataService) {
  }

  ngOnInit(): void {
    this.getTokenomicsData();
    this.getCurrency();
  }

  getTokenomicsData(): void {
    this.data = this.tokenomicsService.tokenomicsData;
    this.replaceData();

    this.tokenomicsService.whenShared().subscribe((data) => {
      this.data = data;
      this.replaceData();
    });
  }

  doChangePancakeRouter() {
    this.tokenomicsService.changePancakeRouter();
  }

  replaceData(): void {
    // this.list[0][1]['val'] = this.data['circulatingSupply'];
    // this.list[0][2]['val'] = this.data['burnedAmount'];
    // this.list[1][0]['val'] = this.data['priceFor1BNB'];
    // this.list[1][0]['val'] = this.data['priceFor1BNB'];
    // this.list[1][1]['val'] = '$' + this.data['marketcap'].substring(0,13);
    // this.list[1][2]['val'] = '$' + this.data['priceFor1mMoonshot'].substring(0,13);
    // this.list[1][3]['val'] = '$' + this.data['priceForMoonshot'].substring(0,13);
    this.isOldPancakeRouter = this.tokenomicsService.oldPancakeAddress;
  }

  toggleTokenomics(): void {
    this.tokenomicsService.onToggle(false);
  }

  currencyArray :any = [];
  getCurrency(){
   
    let url = 'https://api.nomics.com/v1/currencies/ticker?key=920658b737563c66db773020070f4f13ff705c6b&ids=&interval=1d,30d&convert=EUR&platform-currency=&per-page=100&page=1'
     this.getDataService.getcryptos(url).subscribe(
       (res:any)=>{
 
        res.forEach(element => {
            if(element.currency == 'BNB' || element.currency == 'BTC' || element.currency == 'SOL' || element.currency == 'ETH' || element.currency == 'ADA') {
              this.currencyArray.push(element)
            }
        });

        
       }
     );
      
       
  }


}
