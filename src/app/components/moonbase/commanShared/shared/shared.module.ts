import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from '../../collection-card/collection-card.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CustomUrlTransformPipe } from 'src/app/services/custom-url-transform.pipe';



@NgModule({
  declarations: [CollectionCardComponent,CustomUrlTransformPipe],
  imports: [
    CommonModule,
    AppRoutingModule,
    LazyLoadImageModule
  ],
  exports:[CollectionCardComponent,CustomUrlTransformPipe]
})
export class SharedModule { }
