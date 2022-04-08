import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseNfttypeComponent } from '../choose-nfttype/choose-nfttype.component';
import { CreateNftComponent } from '../create-nft/create-nft.component';
import { DetailsComponent } from '../details/details.component';
import { NftDetailsPageComponent } from '../nft-details-page/nft-details-page.component';

const routes: Routes = [
  { path: '', component: ChooseNfttypeComponent },

   { path: 'createNft', component: CreateNftComponent },
  
  { path: 'createNft/type/:type', component: CreateNftComponent },
  
  { path: 'nftDetails/id/:nftId', component: NftDetailsPageComponent },
  
  { path: 'details', component: DetailsComponent },
  
  { path: 'details/:nftAddress/:nftTokenID', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftRoutingModule { }
