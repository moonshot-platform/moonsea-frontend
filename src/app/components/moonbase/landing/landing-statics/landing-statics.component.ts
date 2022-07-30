import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { PricingApiService } from 'src/app/services/pricing-api.service';

@Component({
  selector: 'app-landing-statics',
  templateUrl: './landing-statics.component.html',
  styleUrls: ['./landing-statics.component.scss']
})
export class LandingStaticsComponent implements OnInit {
  statics: any = {};

    
    constructor(private homeService:HomeService,public pricingApi: PricingApiService,private router:Router) { }

  ngOnInit(): void {
    this.getStatics();
  }

  getStatics(){
    this.homeService.getHompageStatics().subscribe((res: any) => {
      this.statics = res.data;
    });
  }

  stats() {
    
  }
 
}
