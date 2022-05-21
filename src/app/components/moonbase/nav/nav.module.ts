import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UiSwitchModule } from 'ngx-ui-switch';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';



@NgModule({
  declarations: [
    NavComponent,
    RegistrationFormComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    UiSwitchModule.forRoot({
      color: 'rgb(0, 189, 99)',
      switchColor: 'black',
      defaultBgColor: 'transparent',
      defaultBoColor : 'black',
    }),
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
