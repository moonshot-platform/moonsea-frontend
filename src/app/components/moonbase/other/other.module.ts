import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherRoutingModule } from './other-routing.module';
import { StatsComponent } from '../stats/stats.component';
import { HowItWorkComponent } from '../how-it-work/how-it-work.component';
import { SharedModule } from '../commanShared/shared/shared.module';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { TransformNumberPipe } from './transform-number.pipe';


@NgModule({
  declarations: [
    StatsComponent,
    HowItWorkComponent,
    TransformNumberPipe
  ],
  imports: [
    CommonModule,
    OtherRoutingModule,
    SharedModule,
    SwiperModule,
    MaterialModule
  ]
})
export class OtherModule { }
