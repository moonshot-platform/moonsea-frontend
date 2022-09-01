import { NavModule } from './nav/nav.module';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { MoonbaseRoutingModule } from './moonbase-routing.module';
import { MoonbaseComponent } from './moonbase.component';
import { IntroComponent } from './intro/intro.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ConnectWalletComponent } from './connect-wallet/connect-wallet.component';
import { ReportComponent } from './details-pop-up/report/report.component';
import { ConnectWalletPopupComponent } from './connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { LandingComponent } from './landing/landing.component';
import { NiceSelectModule } from 'ng-nice-select';
import { RatesComponent } from './rates/rates.component';
import { WalletConnectComponent } from './wallet-connect/wallet-connect.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { ShareModule } from 'ngx-sharebuttons';
import { LandingIntroComponent } from './landing/landing-intro/landing-intro.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialSharePopUpComponent } from './common/social-share-pop-up/social-share-pop-up.component';
import { BetaversionModalComponent } from './landing/betaversion-modal/betaversion-modal.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CreatorComponent } from './creator/creator.component';
import { LandingOneComponent } from './landing/landing-one/landing-one.component';
import { LandingStaticsComponent } from './landing/landing-statics/landing-statics.component';
import { LandingHotCollectionComponent } from './landing/landing-hot-collection/landing-hot-collection.component';
import { LandingTopCollectionComponent } from './landing/landing-top-collection/landing-top-collection.component';
import { LandingNewCollectionsComponent } from './landing/landing-new-collections/landing-new-collections.component';
import { LangdingUpcomingCollectionsComponent } from './landing/langding-upcoming-collections/langding-upcoming-collections.component';
import { LandingFooterComponent } from './landing/landing-footer/landing-footer.component';
import { LandingSearchComponent } from './landing/landing-search/landing-search.component';
import { SharedModule } from './commanShared/shared/shared.module';

import {NgxPaginationModule} from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import { HttpInterceptorInterceptor } from '../interceptor/http-interceptor.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    MoonbaseComponent,
    IntroComponent,
    FooterComponent,
    ConnectWalletComponent,
    ReportComponent,
    ConnectWalletPopupComponent,
    RatesComponent,
    WalletConnectComponent,
    SearchCollectionComponent,
    SocialSharePopUpComponent,
    BetaversionModalComponent,
    CreatorComponent,

    LandingComponent,
    LandingIntroComponent,
    LandingOneComponent,
    LandingStaticsComponent,
    LandingHotCollectionComponent,
    LandingTopCollectionComponent,
    LandingNewCollectionsComponent,
    LangdingUpcomingCollectionsComponent,
    LandingFooterComponent,
    LandingSearchComponent,
    
  ],
  imports: [
    BrowserAnimationsModule ,
    CommonModule,
    MoonbaseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ShareIconsModule,
    SwiperModule,
    NavModule,
    NiceSelectModule ,
    ShareModule,
    LazyLoadImageModule,
    SharedModule,
    NgxPaginationModule,
    MaterialModule
  ],
  exports : [
    LandingIntroComponent,
    RatesComponent,
    WalletConnectComponent,
  ],
  providers: [DatePipe, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true }],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA]
})
export class MoonbaseModule { }
