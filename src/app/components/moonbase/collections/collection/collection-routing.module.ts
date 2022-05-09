import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllcollectionComponent } from '../allcollection/allcollection.component';
import { CollectiondetailsComponent } from '../collectiondetails/collectiondetails.component';
import { MycollectionsComponent } from '../mycollections/mycollections.component';

const routes: Routes = [
  { path: '', component: MycollectionsComponent },
  {path: 'collection/:name',component: CollectiondetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionRoutingModule {}
