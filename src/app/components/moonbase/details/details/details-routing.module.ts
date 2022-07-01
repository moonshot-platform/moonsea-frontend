import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NftDetailsPageComponent } from '../../nft-details-page/nft-details-page.component';
import { DetailsComponent } from '../details.component';

const routes: Routes = [
  { path: ':nftAddress/:nftTokenID', component: DetailsComponent },
  { path: 'nftDetails/id/:nftId', component: NftDetailsPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsRoutingModule { }
