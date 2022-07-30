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
import { CollectiondetailsComponent } from '../collectiondetails/collectiondetails.component';
import { AllcollectionComponent } from '../allcollection/allcollection.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialModule } from 'src/app/material/material.module';
import { ModalForCreateNftComponent } from '../../create-nft/modal-for-create-nft/modal-for-create-nft.component';
import { CreateCollectionComponent } from '../../create-nft/create-collection/create-collection.component';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ImportCollectionComponent } from '../mycollections/import-collection/import-collection.component';
import { AddEditNftComponent } from '../mycollections/step/add-edit-nft/add-edit-nft.component';

@NgModule({
  declarations: [
    MycollectionsComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    CollectiondetailsComponent,
    AllcollectionComponent,
    ModalForCreateNftComponent,
    CreateCollectionComponent,
    ImportCollectionComponent,
    AddEditNftComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    LazyLoadImageModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DateTimePickerModule,
    FormsModule,
    MaterialModule
  ]
})
export class CollectionModule { 
  constructor(){ }
}
