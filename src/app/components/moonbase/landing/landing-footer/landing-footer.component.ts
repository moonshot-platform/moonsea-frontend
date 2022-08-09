import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss']
})
export class LandingFooterComponent implements OnInit {
  slider: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    
    scrollbar: { draggable: true },
  };
 @Input() hotCollectionList :any = [];
  walletAddress: string;
  constructor(private homeService:HomeService, private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.walletAddress = localStorage.getItem('address');
    // this.getHotCollection();
  }

  // getHotCollection(){
  //   this.ngxService.start();
  //   let url = `home/getHotBidList?walletAddress=${this.walletAddress}`;
  //     //  this.homeService.getRequest(url).subscribe((response: any) => {
  //       this.homeService.getUpcommingCollection().subscribe((response: any) => {
     
  //     for (let i = 0; i < response.data.length; i++) {
  //       for (let j = 0; j < response.data[i].nftDetailsList.length; j++) {
  //         response.data[i].nftFileUrl01 =
  //           response.data[i].nftDetailsList[0].nftFileUrl;
  //         response.data[i].nftTokenID01 =
  //           response.data[i].nftDetailsList[0].nftTokenID;
  //         response.data[i].nftAddress =
  //           response.data[i].nftDetailsList[0].nftAddress;
  //       }
  //     }
  //     this.ngxService.stop();
  //     this.hotCollectionList = response.data;
  //   },(err:any)=>{
  //     this.ngxService.stop();
  //   }
  //   );
  // }
}
