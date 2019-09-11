import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from '@components/home-page/home-page.component';
import { ListEventUserPageComponent } from '@components/profile/list-event-user-page.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { EventComponent } from '@components/event/event.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'list-user', component: ListEventUserPageComponent},
  {path: 'event', component: EventComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
