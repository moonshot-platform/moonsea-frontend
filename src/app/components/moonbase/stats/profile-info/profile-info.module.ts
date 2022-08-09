import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileInfoRoutingModule } from './profile-info-routing.module';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { SharedModule } from '../../commanShared/shared/shared.module';
import { UpdateProfileComponent } from '../../update-profile/update-profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserProfileComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileInfoRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProfileInfoModule { }
