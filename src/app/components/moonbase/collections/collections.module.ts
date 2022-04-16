import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollectionsRoutingModule } from './collections-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';

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
  ],
  bootstrap: [],
})
export class CollectionModule {
    constructor(){
        console.log("CollectionModule is loaded");
        
    }
}
