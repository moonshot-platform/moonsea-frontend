import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CollectionsRoutingModule } from './collections-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditNftComponent } from './mycollections/step/add-edit-nft/add-edit-nft.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    CollectionsRoutingModule,
    SharedModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule
  ],
  declarations: [
  
    AddEditNftComponent
  ],
  bootstrap: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CollectionModule {
    constructor(){
        console.log("CollectionModule is loaded");
        
    }
}
