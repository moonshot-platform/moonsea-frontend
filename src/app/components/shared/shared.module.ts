import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from '../moonbase/collection-card/collection-card.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AvatarComponent } from '../moonbase/avatar/avatar.component';
import { NftCardComponent } from '../moonbase/nft-card/nft-card.component';
import { RouterModule, Routes } from '@angular/router';
import { CountDownComponent } from '../moonbase/count-down/count-down.component';


@NgModule({
  declarations: [
    CollectionCardComponent,
    AvatarComponent,
    NftCardComponent,
   
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,  
    RouterModule,
  ],
  exports:[
    CollectionCardComponent,
    AvatarComponent,
    NftCardComponent,
    LazyLoadImageModule,
  ]
})
export class SharedModule { }
