import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { SearchCollectionComponent } from './search-collection/search-collection.component';

const routes: Routes = [
  { path: 'searchcollection', component: SearchCollectionComponent },
  {path: 'home',component: LandingComponent},
  {path: 'admin',loadChildren: () =>import('./admin/admin.module').then((m) => m.AdminModule)},
  {path: 'mycollection',loadChildren: () =>import('./collections/collection/collection.module').then((m) => m.CollectionModule),},
  {path:'detailsCom',loadChildren:()=> import('./details/details/details.module').then(m=>m.DetailsModule)},
  {path:'profileinfo',loadChildren:()=> import('./stats/profile-info/profile-info.module').then(m=>m.ProfileInfoModule)},
  {path:'others',loadChildren:()=>import('./other/other.module').then(m=>m.OtherModule)},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MoonbaseRoutingModule {}
