import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopCollectionListComponent } from './top-collection-list/top-collection-list.component';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [
    TopCollectionListComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule
  ]
})
export class StatsMModule { }
