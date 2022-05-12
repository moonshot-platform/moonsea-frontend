import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-one',
  templateUrl: './landing-one.component.html',
  styleUrls: ['./landing-one.component.scss']
})
export class LandingOneComponent implements OnInit {
  slider: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,

    scrollbar: { draggable: true },
  };
  newCollection: any = [];
  elementsHasLoaded: boolean[] = [];
  loaded: boolean;
  loaded01: boolean;
  loaded02: boolean;

  constructor(
    private homeService: HomeService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private httpClient: HttpClient) {
    for (let index = 0; index < 100; index++) {
      this.elementsHasLoaded[index] = false;
    }
  }

  ngOnInit(): void {
    this.getCollection();
  }

  getCollection() {
    // this.homeService.getNewCollections().subscribe((response: any) => {
    this.homeService.getUpcommingCollection().subscribe((response: any) => {
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
    }, (err: any) => {
      this.ngxService.stop();
    });
  }

  gotoNftDetails(nftAddress: any, id: any) {
    this.router.navigate(['details', nftAddress, id]);
  }

  onMediaLoad(event, index) {
   
    if (event && event.target) {
      // console.log("IMAGE HAS LOADED!");
      this.elementsHasLoaded[index] = true;
    } else {
      this.elementsHasLoaded[index] = false;
      // console.log("IMAGE HAS NOT LOADED!");
    }
  }
}
