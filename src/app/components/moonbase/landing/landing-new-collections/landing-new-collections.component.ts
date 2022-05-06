import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper';

// import Swiper core and required modules
import SwiperCore, { Grid, Pagination } from "swiper";

// install Swiper modules
SwiperCore.use([Grid, Pagination]);

@Component({
  selector: 'app-landing-new-collections',
  templateUrl: './landing-new-collections.component.html',
  styleUrls: ['./landing-new-collections.component.scss'],
})
export class LandingNewCollectionsComponent implements OnInit {
  newCollection :any = [];
  upCommingCollection :any = [];
  newCollectionslider: SwiperOptions = {
    slidesPerView: 3,
    grid: {
      fill: 'row',
      rows: 3
    },
    navigation: true,
    
    scrollbar: { draggable: true },
  };
  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 10,
    navigation: true,
    scrollbar: { draggable: true },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      },
      1600: {
        slidesPerView: 3,
      },
    },
  };
  constructor(private homeService:HomeService,private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getNewCollections();
    this.getUpcommingCollection();
  }


  getNewCollections(){
     this.homeService.getNewCollections().subscribe((response: any) => {
      this.ngxService.stop();
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

      this.newCollection = response.data;
    },(err:any)=>{
      this.ngxService.stop();
    });
  }

  getUpcommingCollection(){
    this.homeService.getUpcommingCollection().subscribe(
      (response:any)=>{
        if(response.isSuccess){
          this.ngxService.stop();
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
          this.upCommingCollection = response.data;
          
        }
        
      },(err:any)=>{
        this.ngxService.stop();
      }
    )
  }
}
