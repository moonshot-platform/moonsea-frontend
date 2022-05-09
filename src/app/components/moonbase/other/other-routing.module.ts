import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowItWorkComponent } from '../how-it-work/how-it-work.component';
import { StatsComponent } from '../stats/stats.component';


const routes: Routes = [
  { path: 'stats', component: StatsComponent },
  { path: 'how_it_works', component: HowItWorkComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
