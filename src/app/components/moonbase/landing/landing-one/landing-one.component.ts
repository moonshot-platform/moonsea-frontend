import { Component, DoCheck, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
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
export class LandingOneComponent implements OnInit ,DoCheck{
  slider: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,

    scrollbar: { draggable: true },
  };
  @Input() newCollection: any = [];
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
  ngDoCheck(): void {
  }

  ngOnInit(): void {
  }


  gotoNftDetails(nftAddress: any, id: any) {
    this.router.navigate(['details', nftAddress, id]);
  }

  onMediaLoad(event, index) {
   
    if (event && event.target) {
 
      this.elementsHasLoaded[index] = true;
    } else {
      this.elementsHasLoaded[index] = false;

    }
  }
}
