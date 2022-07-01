import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ContractService } from 'src/app/services/contract.service';
import { HomeService } from 'src/app/services/home.service';
import SwiperCore, { SwiperOptions, Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-how-it-work',
  templateUrl: './how-it-work.component.html',
  styleUrls: ['./how-it-work.component.scss']
})
export class HowItWorkComponent implements OnInit {

  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  background: ThemePalette = undefined;
  connectedAddress: any;
  hotCollectionList: any;
  firstApi:boolean=false;

  constructor(private ngxService: NgxUiLoaderService, private cs:ContractService, private homeService:HomeService,
    private router : Router) { }

  ngOnInit(): void {
    this.cs.getWalletObs().subscribe((data: any) => {
      this.connectedAddress = data;
      this.getCollectionList();
    });
  }


  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 50,
    
    navigation: true,
    scrollbar: { draggable: true },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      480: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 2
      },
      992: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 3
      },
      1600: {
        slidesPerView: 3
      }
    
  }
};

getCollectionList() {
  this.ngxService.start();
  let url = `home/getHotBidCollectionList`;
  
  this.homeService.getRequest(url).subscribe((response: any) => {
     if(response.status == 200){
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
      this.hotCollectionList = response.data; 
      this.ngxService.stop()
     }else{
      this.ngxService.stop()
     }
  
   
  },(err:any)=>{
    this.ngxService.stop()
  });
}




}
