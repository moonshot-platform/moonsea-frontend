import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { AllcollectionComponent } from './allcollection/allcollection.component';
import { CollectiondetailsComponent } from './collectiondetails/collectiondetails.component';
import { CollectionsRoutingModule } from './collections-routing.module';
import { ListOfCollectionsComponent } from './list-of-collections/list-of-collections.component';
import { MycollectionsComponent } from './mycollections/mycollections.component';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    CollectionsRoutingModule,
    SharedModule,
    MatSelectModule,
    FormsModule
  ],
  declarations: [
    ListOfCollectionsComponent,
    AllcollectionComponent,
    CollectiondetailsComponent,
    MycollectionsComponent,
  ],
  bootstrap: [],
})
export class CollectionModule {
    constructor(){
        console.log("CollectionModule is loaded");
        
    }
}
