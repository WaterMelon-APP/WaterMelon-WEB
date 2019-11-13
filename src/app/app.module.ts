import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';

import { AppComponent } from './app.component';
import { LoginFormComponent } from '@components/login-form/login-form.component';
import { HomePageComponent } from '@components/home-page/home-page.component';
import { NavComponentComponent } from '@components/nav-component/nav-component.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { UpdateProfileComponent } from '@components/update-profile/update-profile.component';
import { ListEventUserPageComponent } from '@components/profile/list-event-user-page.component';
import { EventComponent } from '@components/event/event.component';
import { RegisterFormComponent } from '@components/register/register-form.component';
import { CreateEventComponent } from '@components/event/create-event.component';
import { ItemListComponent } from '@components/item/item-list.component';

import { EventService } from '@services/event.service';
import { ItemService } from '@services/item.service';
import { UserService } from '@services/user.service';

import { GoogleSignInComponent } from 'angular-google-signin';
import { EmailComponent } from './components/email/email.component';

const parse = require('parse');

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponentComponent,
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
    ItemListComponent,
    ProfileComponent,
    ListEventUserPageComponent,
    UpdateProfileComponent,
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
    ItemListComponent,
    EventComponent,
    GoogleSignInComponent,
    EmailComponent
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
    ItemListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    parse.initialize("OwSChGtDD8UV6I0F1MApF8V40KZfl9ex26rLyctc", "4RETRc4i3ILpP2X8dPjXbHJpAZw4rMGNI4BD24e2");
    parse.serverURL = 'http://watermelonserver.herokuapp.com/parse';
  }
}
