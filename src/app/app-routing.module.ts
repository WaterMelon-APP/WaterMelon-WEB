import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from './components/home-page/home-page.component';
import { ListEventUserPageComponent } from './components/profile/list-event-user-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventComponent } from './components/event/event.component';
import { EditEventComponent } from './components/event/edit-event.component';
import { SearchComponent } from './components/search/search-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register/register-form.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'list-user', component: ListEventUserPageComponent},
  {path: 'event/:id', component: EventComponent },
  {path: 'event-edit/:id', component: EditEventComponent},
  {path: 'search/:id', component: SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = [HomePageComponent,
                                ProfileComponent,
                                ListEventUserPageComponent,
                                EventComponent,
                                EditEventComponent,
                                SearchComponent,
                                ]
