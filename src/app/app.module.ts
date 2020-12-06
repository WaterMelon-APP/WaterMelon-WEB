import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { MatNativeDateModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavComponentComponent } from './components/nav-component/nav-component.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ListEventUserPageComponent } from './components/profile/list-event-user-page.component';
import { EventComponent } from './components/event/event.component';
import { RegisterFormComponent } from './components/register/register-form.component';
import { CreateEventComponent } from './components/event/create-event.component';
import { EditEventComponent } from './components/event/edit-event.component';
import { SearchComponent } from './components/search/search-page.component';
import { CardEventAdminComponent } from './components/card-event-admin/card-event-admin.component';
import { CardEventMemberComponent } from './components/card-event-member/card-event-member.component';
import { CardDiscoveryComponent } from './components/card-discovery/card-discovery.component';
import { CardEditEventComponent } from './components/card-edit-event/card-edit-event.component';
import { AlertComponent } from './components/alert/alert.component';
import { NotifMenuComponent } from './components/notif-menu/notif-menu.component';
import { NotifInvitMenuComponent } from './components/notif-invit-menu/notif-invit-menu.component';
import { NotifInfoMenuComponent } from './components/notif-info-menu/notif-info-menu.component';
import { NotifModifEventComponent } from './components/notif-modif-event/notif-modif-event.component';
import { NotifInvitResponseComponent } from './components/notif-invit-response/notif-invit-response.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponentComponent,
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
    EditEventComponent,
    ProfileComponent,
    ListEventUserPageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
    EventComponent,
    SearchComponent,
    CardEventAdminComponent,
    CardEventMemberComponent,
    CardDiscoveryComponent,
    CardEditEventComponent,
    AlertComponent,
    NotifMenuComponent,
    NotifInvitMenuComponent,
    NotifInfoMenuComponent,
    NotifModifEventComponent,
    NotifInvitResponseComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatNativeDateModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
  }
}
