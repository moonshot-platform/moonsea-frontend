import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GetDataService } from 'src/app/services/get-data.service';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    AdminComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers :[GetDataService]
})
export class AdminModule { }
