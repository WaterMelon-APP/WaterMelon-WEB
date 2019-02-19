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
import { RegisterFormComponent } from './component/services/register-form/register-form.component';
import { CreateEventComponent } from './component/services/create-event/create-event.component';
import { ItemListComponent } from './component/services/item-list/item-list.component';


const parse = require('parse');



@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavComponentComponent,
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent,
    ItemListComponent
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
    BrowserAnimationsModule
  ],
  entryComponents: [
    LoginFormComponent,
    RegisterFormComponent,
    CreateEventComponent
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
