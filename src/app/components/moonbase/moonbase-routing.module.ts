import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import { LandingComponent } from './landing/landing.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: 'activity', component: ActivityComponent },
  
  { path: 'searchcollection', component: SearchCollectionComponent },
  
  { path: 'stats', component: StatsComponent },
   
  { path: 'how_it_works', component: HowItWorkComponent },
  
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  
  {path: 'home',component: LandingComponent, },
  
  {path: 'admin',loadChildren: () =>import('./admin/admin.module').then((m) => m.AdminModule),},
  
  {path:'collections',loadChildren:()=> import('./collections/collections.module').then(m=>m.CollectionModule)},

  {path:'profile',loadChildren:()=>import('./user-profile/user-profile/user-profile.module').then(m=>m.UserProfileModule)},

  {path:'createNFT',loadChildren:()=>import('./nft/nft.module').then(m=>m.NftModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoonbaseRoutingModule {}
