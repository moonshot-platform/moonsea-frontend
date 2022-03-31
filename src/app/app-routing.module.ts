import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: MoonbaseComponent.routeName,
  //   component: MoonbaseComponent
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
