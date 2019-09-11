import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomePageComponent} from './page/home-page/home-page.component';
import {ListEventUserPageComponent} from './page/list-event-user-page/list-event-user-page.component';
import { ProfileComponent } from './component/profile/profile.component';
import { EventComponent } from './component/event/event.component';

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
