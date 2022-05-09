import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateProfileComponent } from '../../update-profile/update-profile.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

const routes: Routes = [
  { path: 'updateProfile', component: UpdateProfileComponent },
  { path: 'profile/:username', component: UserProfileComponent },
  { path: 'profile/:username/tab/:tabName', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileInfoRoutingModule { }
