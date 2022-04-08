import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NftRoutingModule } from './nft-routing.module';
import { CreateNftComponent } from '../create-nft/create-nft.component';
import { NftDetailsPageComponent } from '../nft-details-page/nft-details-page.component';
import { DetailsComponent } from '../details/details.component';
import { NftDetailListTabsComponent } from '../nft-detail-list-tabs/nft-detail-list-tabs.component';
import { BidsComponent } from '../nft-detail-list-tabs/bids/bids.component';
import { HistoryComponent } from '../nft-detail-list-tabs/history/history.component';
import { PlaceBidComponent } from '../nft-card/place-bid/place-bid.component';
import { PurchaseNowComponent } from '../nft-card/purchase-now/purchase-now.component';
import { SharedModule } from '../../shared/shared.module';
import { CountDownComponent } from '../count-down/count-down.component';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChooseNfttypeComponent } from '../choose-nfttype/choose-nfttype.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@NgModule({
  declarations: [
    CreateNftComponent,
    NftDetailsPageComponent,
    DetailsComponent,
    NftDetailListTabsComponent,
    BidsComponent,
    HistoryComponent,
    PlaceBidComponent,
    PurchaseNowComponent,
    CountDownComponent,
    ChooseNfttypeComponent
    
  ],
  imports: [
    CommonModule,
    NftRoutingModule,
    SharedModule,
    DateTimePickerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    LazyLoadImageModule
  ]
})
export class NftModule { }
