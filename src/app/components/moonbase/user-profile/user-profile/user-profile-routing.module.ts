import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateProfileComponent } from '../../update-profile/update-profile.component';
import { UserProfileComponent } from '../user-profile.component';

const routes: Routes = [
  {path:'profile/:username',component:UserProfileComponent},

  { path: 'profile/:username/tab/:tabName', component: UserProfileComponent },

  { path: 'updateProfile', component: UpdateProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
