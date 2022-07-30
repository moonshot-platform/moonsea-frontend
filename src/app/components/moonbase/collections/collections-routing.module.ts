import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectiondetailsComponent } from './collectiondetails/collectiondetails.component';
import { ListOfCollectionsComponent } from './list-of-collections/list-of-collections.component';
import { MycollectionsComponent } from './mycollections/mycollections.component';


const routes: Routes = [
    { path: '', component: ListOfCollectionsComponent },
    { path: 'collection/:name', component: CollectiondetailsComponent },
    { path: 'mycollections', component: MycollectionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }