import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeModule } from './home';
import { EventModule } from './event';
import { NavModule } from './nav';

// import { ProfileComponent } from '@components/profile/profile.component';
// import { UpdateProfileComponent } from '@components/update-profile/update-profile.component';
// import { ListEventUserPageComponent } from '@components/profile/list-event-user-page.component';
// import { ItemListComponent } from '@components/item/item-list.component';

import { GoogleSignInComponent } from 'angular-google-signin';
import { EmailComponent } from './components/email/email.component';

const parse = require('parse');

@NgModule({
  declarations: [
    AppComponent,
    HomeModule,
    EventModule,
    NavModule,
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
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    parse.initialize("OwSChGtDD8UV6I0F1MApF8V40KZfl9ex26rLyctc", "4RETRc4i3ILpP2X8dPjXbHJpAZw4rMGNI4BD24e2");
    parse.serverURL = 'http://watermelonserver.herokuapp.com/parse';
  }
}
