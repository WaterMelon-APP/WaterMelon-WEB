import { RegisterFormComponent } from '../../component/services/register-form/register-form.component';
import { CreateEventComponent } from '../../component/services/create-event/create-event.component';

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as Parse from 'parse';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isLoggedIn = false;
  constructor(public dialog: MatDialog) {
    if (Parse.User.current()) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
  }

  Register() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(RegisterFormComponent, dialogConfig);
  }

  createEvent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateEventComponent, dialogConfig);
  }
}
