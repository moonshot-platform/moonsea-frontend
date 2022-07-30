import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionsRoutingModule } from './collections-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditNftComponent } from './mycollections/step/add-edit-nft/add-edit-nft.component';
import { ModelForCreateCollectionComponent } from './model-for-create-collection/model-for-create-collection.component';
import { CollectiondetailsComponent } from './collectiondetails/collectiondetails.component';
import { AllcollectionComponent } from './allcollection/allcollection.component';
import { SharedModule } from '../commanShared/shared/shared.module';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    CollectionsRoutingModule,
    SharedModule,
    MatSelectModule,
    FormsModule,  
    MatTabsModule,
  ],
  declarations: [
    CollectiondetailsComponent,
    AllcollectionComponent,
    AddEditNftComponent,
    ModelForCreateCollectionComponent
  ]
})
export class CollectionModule {
  constructor() {

  }
}
