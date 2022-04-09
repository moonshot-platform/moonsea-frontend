import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { ChooseNfttypeComponent } from './choose-nfttype/choose-nfttype.component';
import { AllcollectionComponent } from './collections/allcollection/allcollection.component';
import { CollectiondetailsComponent } from './collections/collectiondetails/collectiondetails.component';
import { CollectionsComponent } from './collections/collections.component';
import { ListOfCollectionsComponent } from './collections/list-of-collections/list-of-collections.component';
import { MycollectionsComponent } from './collections/mycollections/mycollections.component';
import { ChooseCollectionComponent } from './create-nft-new/choose-collection/choose-collection.component';
import { CreateNftComponent } from './create-nft/create-nft.component';
import { DetailsComponent } from './details/details.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import { LandingComponent } from './landing/landing.component';
import { NftDetailsPageComponent } from './nft-details-page/nft-details-page.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { StatsComponent } from './stats/stats.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  
  {
    path: 'activity',
    component: ActivityComponent,
  },
  {
    path: 'collections011',
    component: CollectionsComponent,
  },
  {
    path: 'collections',
    component: ListOfCollectionsComponent,
  },
  {
    path: 'createNft',
    component: ChooseNfttypeComponent,
  },
  {
    path: 'Allcollection',
    component: AllcollectionComponent,
  },
  {
    path: 'collection/:name',
    component: CollectiondetailsComponent,
  },
  {
    path: 'choose-collection',
    component: ChooseCollectionComponent,
  },
  { path: 'searchcollection', component: SearchCollectionComponent },
  { path: 'updateProfile', component: UpdateProfileComponent },
  { path: 'mycollections', component: MycollectionsComponent },
  { path: 'createNft', component: CreateNftComponent },
  { path: 'profile/:username', component: UserProfileComponent },
  { path: 'profile/:username/tab/:tabName', component: UserProfileComponent },
  { path: 'createNft/type/:type', component: CreateNftComponent },
  { path: 'nftDetails/id/:nftId', component: NftDetailsPageComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'details/:nftAddress/:nftTokenID', component: DetailsComponent },
  { path: 'activity', component: ActivityComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'collections/:id', component: CollectionsComponent },
  { path: 'how_it_works', component: HowItWorkComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  // {
  //   path: MoonbaseComponent.routeName,
  //   component: MoonbaseComponent,
  //   children: [
  //     // {
  //     //   path: LandingComponent.routeName,
  //     //   component: LandingComponent,
  //     // },
  //     // {
  //     //   path: IntroComponent.routeName,
  //     //   component: IntroComponent,
  //     // },
  //     // {
  //     //   path: UpcomingComponent.routeName,
  //     //   component: UpcomingComponent,
  //     //   data: { activeTab: 1 }
  //     // },
  //     // {
  //     //   path: InfoComponent.routeName,
  //     //   component: InfoComponent,
  //     // },
  //     // {
  //     //   path: '**',
  //     //   redirectTo: MoonbaseComponent.routeName,
  //     // },
  //   ],
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoonbaseRoutingModule {}
