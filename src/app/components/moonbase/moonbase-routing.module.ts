import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';

import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import { LandingComponent } from './landing/landing.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';
import { StatsComponent } from './stats/stats.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'activity',
    component: ActivityComponent,
  }, 
 
  { path: 'searchcollection', component: SearchCollectionComponent },
  { path: 'updateProfile', component: UpdateProfileComponent },

  { path: 'profile/:username', component: UserProfileComponent },
  { path: 'profile/:username/tab/:tabName', component: UserProfileComponent },
 
  { path: 'activity', component: ActivityComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'how_it_works', component: HowItWorkComponent },
  {path: '',component: LandingComponent},
  {path: 'admin',loadChildren: () =>import('./admin/admin.module').then((m) => m.AdminModule)},
  {path: 'mycollection',loadChildren: () =>import('./collections/collection/collection.module').then((m) => m.CollectionModule),},
  {path:'detailsCom',loadChildren:()=> import('./details/details/details.module').then(m=>m.DetailsModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MoonbaseRoutingModule {}
