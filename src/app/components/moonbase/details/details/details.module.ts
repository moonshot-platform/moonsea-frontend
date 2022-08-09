import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from '../details.component';
import { NftDetailListTabsComponent } from '../../nft-detail-list-tabs/nft-detail-list-tabs.component';
import { BidsComponent } from '../../nft-detail-list-tabs/bids/bids.component';
import { HistoryComponent } from '../../nft-detail-list-tabs/history/history.component';
import { PlaceBidComponent } from '../../nft-card/place-bid/place-bid.component';
import { PurchaseNowComponent } from '../../nft-card/purchase-now/purchase-now.component';
import { SharedModule } from '../../commanShared/shared/shared.module';
import { NftDetailsPageComponent } from '../../nft-details-page/nft-details-page.component';
import { PlaceBidModalComponent } from '../../nft-card/place-bid-modal/place-bid-modal.component';
import { AcceptBidPopupComponent } from '../../nft-detail-list-tabs/bids/accept-bid-popup/accept-bid-popup.component';
import { SocialbuttonsComponent } from '../../social-share/socialbuttons/socialbuttons.component';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { ShareModule } from 'ngx-sharebuttons';
import { TransferTokenComponent } from '../../details-pop-up/transfer-token/transfer-token.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BurnTokenComponent } from '../../details-pop-up/burn-token/burn-token.component';
import { AddInListingComponent } from '../../details-pop-up/add-in-listing/add-in-listing.component';
import { DetailsPopUpComponent } from '../../details-pop-up/details-pop-up.component';
import { ChangePriceComponent } from '../../details-pop-up/change-price/change-price.component';
import { RemoveFromSaleComponent } from '../../details-pop-up/remove-from-sale/remove-from-sale.component';
import { OwnersComponent } from '../../nft-detail-list-tabs/owners/owners.component';
import { PurchaseNowModalComponent } from '../../nft-card/purchase-now-modal/purchase-now-modal.component';
import { NiceSelectModule } from 'ng-nice-select';


@NgModule({
  declarations: [
    DetailsComponent,
    NftDetailListTabsComponent,
    BidsComponent,
    HistoryComponent,
    PlaceBidComponent,
    PurchaseNowComponent,
    NftDetailsPageComponent,
    PlaceBidModalComponent,
    AcceptBidPopupComponent,
    SocialbuttonsComponent,
    TransferTokenComponent,
    BurnTokenComponent,
    AddInListingComponent,
    DetailsPopUpComponent,
    ChangePriceComponent,
    RemoveFromSaleComponent,
    OwnersComponent,
    PurchaseNowModalComponent,
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    ShareIconsModule,
    ReactiveFormsModule,
    ShareModule,
    SharedModule,
    NiceSelectModule
  ]
})
export class DetailsModule { }
