import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as Parse from 'parse';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'
import { RegisterFormComponent } from './../register/register-form.component';
import { CreateEventComponent } from './../event/create-event.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isLoggedIn = false;
  token: string;

  constructor(public dialog: MatDialog, private auth: AuthService) {
    this.token = this.auth.getToken();
    if (this.token) {
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