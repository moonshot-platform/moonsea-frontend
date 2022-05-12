import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-top-collection',
  templateUrl: './landing-top-collection.component.html',
  styleUrls: ['./landing-top-collection.component.scss']
})
export class LandingTopCollectionComponent implements OnInit {
  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 50,
    pagination: { clickable: false },
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
  getTopcollection :any = [];
  constructor(private homeService:HomeService,private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getTopCollection();
  }


  getTopCollection(){
    this.ngxService.start();
    // this.homeService.getTopCollectionlist().subscribe(
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

          this.getTopcollection = response.data;
        }
        
      },(err:any)=>{
        this.ngxService.stop();
      }
    )
  }
}
