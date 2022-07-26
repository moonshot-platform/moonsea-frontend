import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { MycollectionsComponent } from '../mycollections/mycollections.component';
import { Step1Component } from '../mycollections/step/step3/step1/step1.component';
import { Step2Component } from '../mycollections/step/step3/step2/step2.component';
import { Step3Component } from '../mycollections/step/step3/step3.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SharedModule } from '../../commanShared/shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    MycollectionsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    LazyLoadImageModule,
    SharedModule,
    MatTabsModule,
    NgxPaginationModule
  ]
})
export class CollectionModule { 
  constructor(){ }
}
