import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginFormComponent } from './component/login-form/login-form.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { NavComponentComponent } from './component/nav-component/nav-component.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';
import { ProfileComponent } from './component/profile/profile.component';

import { RegisterFormComponent } from './component/services/register-form/register-form.component';
import { CreateEventComponent } from './component/services/create-event/create-event.component';
import { ItemListComponent } from './component/services/item-list/item-list.component';
import { UpdateProfileComponent } from './component/update-profile/update-profile.component';
import {ListEventUserPageComponent} from './page/list-event-user-page/list-event-user-page.component';


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
    ListEventUserPageComponent
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
    UpdateProfileComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    parse.initialize('watermelon');
    parse.serverURL = 'http://watermelon-parse.herokuapp.com/parse';
  }
}
