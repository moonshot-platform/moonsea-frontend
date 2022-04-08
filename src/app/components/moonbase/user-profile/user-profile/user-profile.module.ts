import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from '../user-profile.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { UpdateProfileComponent } from '../../update-profile/update-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule 
  ]
})
export class UserProfileModule { }
