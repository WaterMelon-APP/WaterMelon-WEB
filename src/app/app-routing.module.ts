import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeModule } from './home';
import { EventModule } from './event';
// import { ListEventUserPageComponent } from '@components/profile/list-event-user-page.component';
// import { ProfileComponent } from '@components/profile/profile.component';
// import { EventComponent } from '@components/event/event.component';
// import { EmailComponent } from '@components/email/email.component';

const routes: Routes = [
  { path: '', loadChildren: () => HomeModule },
  { path: 'events', loadChildren: () => EventModule }
  // {path: 'profile', component: ProfileComponent},
  // {path: 'list-user', component: ListEventUserPageComponent},
  // {path: 'event', component: EventComponent },
  // {path: 'email', component: EmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
