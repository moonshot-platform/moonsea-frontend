import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-hot-collection',
  templateUrl: './landing-hot-collection.component.html',
  styleUrls: ['./landing-hot-collection.component.scss']
})
export class LandingHotCollectionComponent implements OnInit {
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
  hotCollectionList :any = [];
  constructor(private homeService:HomeService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
  }


  getHotCollection(){
    this.ngxService.start();
    this.homeService.getHotBidCollectionList().subscribe((response: any) => {
     
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
      this.ngxService.stop();
      this.hotCollectionList = response.data;
    },(err:any)=>{
      this.ngxService.stop();
    }
    );
  }
}
