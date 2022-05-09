import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from '../../collection-card/collection-card.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';



@NgModule({
  declarations: [CollectionCardComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    LazyLoadImageModule
  ],
  exports:[CollectionCardComponent]
})
export class SharedModule { }
