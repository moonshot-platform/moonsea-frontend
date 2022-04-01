import { NavComponent } from './nav/nav.component';
import { NavModule } from './nav/nav.module';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

import { MoonbaseRoutingModule } from './moonbase-routing.module';
import { MoonbaseComponent } from './moonbase.component';
import { IntroComponent } from './intro/intro.component';
import { MatIconModule } from '@angular/material/icon';
import { NgParticlesModule } from 'ng-particles';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularCountdownDateTimeModule } from 'angular-countdown-date-time';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { UiSwitchModule } from 'ngx-ui-switch';
import { InfoComponent } from './info/info.component';
import { ActivityComponent } from './activity/activity.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CollectionsComponent } from './collections/collections.component';
import { MatSliderModule } from '@angular/material/slider';
import { NftCardComponent } from './nft-card/nft-card.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CountDownComponent } from './count-down/count-down.component';
import { ChooseNfttypeComponent } from './choose-nfttype/choose-nfttype.component';
import { AllcollectionComponent } from './collections/allcollection/allcollection.component';
import { CollectiondetailsComponent } from './collections/collectiondetails/collectiondetails.component';
import { ConnectWalletComponent } from './connect-wallet/connect-wallet.component';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { CreateCollectionComponent } from './create-nft/create-collection/create-collection.component';
import { ModalForCreateNftComponent } from './create-nft/modal-for-create-nft/modal-for-create-nft.component';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DetailsComponent } from './details/details.component';
import { DetailsPopUpComponent } from './details-pop-up/details-pop-up.component';
import { AddInListingComponent } from './details-pop-up/add-in-listing/add-in-listing.component';
import { BurnTokenComponent } from './details-pop-up/burn-token/burn-token.component';
import { ChangePriceComponent } from './details-pop-up/change-price/change-price.component';
import { RemoveFromSaleComponent } from './details-pop-up/remove-from-sale/remove-from-sale.component';
import { ReportComponent } from './details-pop-up/report/report.component';
import { TransferTokenComponent } from './details-pop-up/transfer-token/transfer-token.component';
import { NftDetailListTabsComponent } from './nft-detail-list-tabs/nft-detail-list-tabs.component';
import { BidsComponent } from './nft-detail-list-tabs/bids/bids.component';
import { HistoryComponent } from './nft-detail-list-tabs/history/history.component';
import { OwnersComponent } from './nft-detail-list-tabs/owners/owners.component';
import { NftDetailsPageComponent } from './nft-details-page/nft-details-page.component';
import { PlaceBidComponent } from './nft-card/place-bid/place-bid.component';
import { PlaceBidModalComponent } from './nft-card/place-bid-modal/place-bid-modal.component';
import { PurchaseNowComponent } from './nft-card/purchase-now/purchase-now.component';
import { PurchaseNowModalComponent } from './nft-card/purchase-now-modal/purchase-now-modal.component';
import { StatsComponent } from './stats/stats.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ImportComponent } from './import/import.component';
import { MycollectionsComponent } from './collections/mycollections/mycollections.component';
import { ConnectWalletPopupComponent } from './connect-wallet/connect-wallet-popup/connect-wallet-popup.component';
import { LandingComponent } from './landing/landing.component';
import { NiceSelectModule } from 'ng-nice-select';
import { RatesComponent } from './rates/rates.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ArraytransformPipe } from './pipe/arraytransform.pipe';
import { WalletConnectComponent } from './wallet-connect/wallet-connect.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { StatsMModule } from './stats-m/stats-m.module';
import { AcceptBidPopupComponent } from './nft-detail-list-tabs/bids/accept-bid-popup/accept-bid-popup.component';
import { LineChartsComponent } from './stats/line-charts/line-charts.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { ListOfCollectionsComponent } from './collections/list-of-collections/list-of-collections.component';
import { ShareModule } from 'ngx-sharebuttons';
import { LandingIntroComponent } from './landing/landing-intro/landing-intro.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SocialbuttonsComponent } from './social-share/socialbuttons/socialbuttons.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChooseCollectionComponent } from './create-nft-new/choose-collection/choose-collection.component';
import {MatStepperModule} from '@angular/material/stepper';
import { CollectioncreationComponent } from './create-nft-new/collectioncreation/collectioncreation.component';
import { UploadnftsComponent } from './create-nft-new/uploadnfts/uploadnfts.component';
import { AddspecificdetailsComponent } from './create-nft-new/addspecificdetails/addspecificdetails.component';
import { CreateCollectionModelComponent } from './create-nft-new/create-collection-model/create-collection-model.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SocialSharePopUpComponent } from './common/social-share-pop-up/social-share-pop-up.component';
import { SearchKeyComponent } from './search-key/search-key.component';
import { BetaversionModalComponent } from './landing/betaversion-modal/betaversion-modal.component';
import { ImportCollectionComponent } from './collections/mycollections/import-collection/import-collection.component';
import { CollectionCardComponent } from './collection-card/collection-card.component';

@NgModule({
  declarations: [
    MoonbaseComponent,
    IntroComponent,
    FooterComponent,
    InfoComponent,
    ActivityComponent,
    AvatarComponent,
    CollectionsComponent,
    NftCardComponent,
    CountDownComponent,
    ChooseNfttypeComponent,
    AllcollectionComponent,
    CollectiondetailsComponent,
    ConnectWalletComponent,
    CreateNftComponent,
    CreateCollectionComponent,
    ModalForCreateNftComponent,
    DetailsComponent,
    DetailsPopUpComponent,
    AddInListingComponent,
    BurnTokenComponent,
    ChangePriceComponent,
    RemoveFromSaleComponent,
    ReportComponent,
    TransferTokenComponent,
    NftDetailListTabsComponent,
    BidsComponent,
    HistoryComponent,
    OwnersComponent,
    NftDetailsPageComponent,
    PlaceBidComponent,
    PlaceBidModalComponent,
    PurchaseNowComponent,
    AcceptBidPopupComponent,
    PurchaseNowModalComponent,
    StatsComponent,
    UpdateProfileComponent,
    UserProfileComponent,
    ImportComponent,
    MycollectionsComponent,
    ConnectWalletPopupComponent,
    LandingComponent,
    RatesComponent,
    ArraytransformPipe,
    WalletConnectComponent,
    AcceptBidPopupComponent,
    LineChartsComponent,
    SearchCollectionComponent,
    ListOfCollectionsComponent,
    LandingIntroComponent,
    SocialbuttonsComponent,
    ChooseCollectionComponent,
    CollectioncreationComponent,
    UploadnftsComponent,
    AddspecificdetailsComponent,
    CreateCollectionModelComponent,
    HowItWorkComponent,
    SocialSharePopUpComponent,
    SearchKeyComponent,
    BetaversionModalComponent,
    ImportCollectionComponent,
    CollectionCardComponent,
  ],
  imports: [
    BrowserAnimationsModule ,
    MatIconModule,
    CommonModule,
    NgParticlesModule,
    NgParticlesModule,
    MoonbaseRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    AngularCountdownDateTimeModule,
    ShareButtonsModule,
    ShareIconsModule,
    SwiperModule,
    UiSwitchModule,
    MatSliderModule,
    MatTooltipModule,
    DateTimePickerModule,
    NavModule,
    NiceSelectModule ,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    NgApexchartsModule,
    MatSelectModule,
    MatButtonModule,
    StatsMModule,
    FormsModule,
    ShareModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
    MatStepperModule,
    MatTabsModule
  ],
  exports : [
    LandingIntroComponent,
    RatesComponent,
    WalletConnectComponent
  ],
  providers: [DatePipe],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA]
})
export class MoonbaseModule { }
