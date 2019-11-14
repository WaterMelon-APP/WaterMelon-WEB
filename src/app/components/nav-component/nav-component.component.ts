import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';

import * as Parse from 'parse';
import { LoginFormComponent} from '@components/login-form/login-form.component';
import { RegisterFormComponent } from '@components/register/register-form.component';
import { CreateEventComponent} from '@components/event/create-event.component';

@Component({
  selector: 'app-nav-component',
  templateUrl: './nav-component.component.html',
  styleUrls: ['./nav-component.component.css']
})

export class NavComponentComponent implements OnInit {

  isLoggedIn = false;
  constructor(public dialog: MatDialog) {
    if (Parse.User.current()) {
      this.isLoggedIn = true;
    }
  }

  signOut() {
    Parse.User.logOut();
    this.isLoggedIn = false;
  }

  ngOnInit() {
  }

  Login() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginFormComponent, dialogConfig).afterClosed().subscribe(() => {
      if (Parse.User.current()) {
        this.isLoggedIn = true;
      }
    });

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
