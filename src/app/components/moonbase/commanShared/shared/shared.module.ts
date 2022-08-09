import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionCardComponent } from '../../collection-card/collection-card.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CustomUrlTransformPipe } from 'src/app/services/custom-url-transform.pipe';
import { AvatarComponent } from '../../avatar/avatar.component';
import { DicimalTransformPipe } from '../../details/dicimal-transform.pipe';
import { CountDownComponent } from '../../count-down/count-down.component';
import { NftCardComponent } from '../../nft-card/nft-card.component';

let component = [CollectionCardComponent,CustomUrlTransformPipe,AvatarComponent,DicimalTransformPipe,CountDownComponent,NftCardComponent];

@NgModule({
    declarations: [...component],
  imports: [
    CommonModule,
    AppRoutingModule,
    LazyLoadImageModule,
  ],
  exports:[...component]
})
export class SharedModule { }
