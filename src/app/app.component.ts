import { Component, HostListener } from '@angular/core';
import { ContractService } from './services/contract.service';
import { PricingApiService } from './services/pricing-api.service';
import { TokenomicsService } from './services/tokenomics.service';
declare let particlesJS: any;

@Component({
  selector: 'app-root',
  template: `<div id="particles"></div>
    <section class="frame flex">
      <div
        class="inner"
        (scroll)="onScroll($event)"
        [ngClass]="{ withBG: isScrollDown === 'yes' }"
      >
        <app-nav></app-nav><router-outlet></router-outlet>
      </div>
      <app-sidebar></app-sidebar>
      <app-landing-intro></app-landing-intro>
    </section>

    <ngx-ui-loader [fgsTemplate]="foregroundSpinner" ></ngx-ui-loader>
    <ng-template #foregroundSpinner>
    <video style="width:110px" autoplay controls [muted]="true" [loop]="true" [controls]="false" class="logo">
          <source src="assets/media/videos/moonsea-animated-logo.webm" type="video/mp4">
        </video>
    </ng-template> `,
})
export class AppComponent {
  isScrollDown: string = 'no';
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.scrollTop == 0) {
      this.isScrollDown = 'no';
    } else {
      this.isScrollDown = 'yes';
    }
  }

  constructor(private cs: ContractService, private pricing: PricingApiService) {
    particlesJS.load('particles', 'assets/json/particlesjs-config.json');
    this.cs.checkLoggedInUser();
    this.pricing.getServiceFee();
  }

  logoUrl = 'assets/icons/giff2.gif';
  // src\assets\icons\giff.gif
  // src\assets\icons\giff2.gif
}
