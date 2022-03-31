import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ShearWithMediaComponent } from './popups/shear-with-media/shear-with-media.component';
import { CheckIsAddressDirective } from './check-is-address.directive';


@NgModule({
  declarations: [
    ShearWithMediaComponent,
    CheckIsAddressDirective,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
  ]
})
export class SharedModule { }
