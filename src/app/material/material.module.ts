import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

const matModule =[MatProgressBarModule,MatProgressSpinnerModule,MatCheckboxModule,MatDialogModule,MatButtonModule,
  MatIconModule,MatExpansionModule,MatTabsModule,MatSelectModule]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...matModule
  ],
  exports:[...matModule]
})
export class MaterialModule { }
