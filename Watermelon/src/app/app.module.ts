import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginFormComponent } from './component/login-form/login-form.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { NavComponentComponent } from './component/nav-component/nav-component.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { ProfileComponent } from './component/profile/profile.component';

import { RegisterFormComponent } from './component/services/register-form/register-form.component';
import { CreateEventComponent } from './component/services/create-event/create-event.component';
import { ItemListComponent } from './component/services/item-list/item-list.component';
import { UpdateProfileComponent } from './component/update-profile/update-profile.component';
import { ListEventUserPageComponent } from './page/list-event-user-page/list-event-user-page.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';


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
    ItemListComponent
  ],
  imports: [
    ReactiveFormsModule,
    MatNativeDateModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule
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
    parse.initialize("OwSChGtDD8UV6I0F1MApF8V40KZfl9ex26rLyctc", "4RETRc4i3ILpP2X8dPjXbHJpAZw4rMGNI4BD24e2");
    parse.serverURL = 'http://watermelonserver.herokuapp.com/parse';
  }
}
