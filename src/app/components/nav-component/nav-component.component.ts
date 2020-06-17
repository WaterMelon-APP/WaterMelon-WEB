import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import * as Parse from 'parse';
import { LoginFormComponent} from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register/register-form.component';
import { CreateEventComponent} from '../event/create-event.component';
import { AuthService } from '../../services/auth.service'


@Component({
  selector: 'app-nav-component',
  templateUrl: './nav-component.component.html',
  styleUrls: ['./nav-component.component.css']
})

export class NavComponentComponent implements OnInit {

  isLoggedIn = false;
  lieu = true;
  nom = true;
  token: string;

  constructor(public dialog: MatDialog, private router: Router, private auth: AuthService) {
    this.token = this.auth.getToken();
    console.log('this.token :>> ', this.token);
    if (this.token) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
  }

  search = new FormControl('', [Validators.required, Validators.requiredTrue]);

  signOut() {
    //Parse.User.logOut(); Modif token
    this.auth.logOut();
    this.isLoggedIn = false;
  }

  Login() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginFormComponent, dialogConfig).afterClosed().subscribe(() => {
      if (this.auth.getToken()) {
        this.isLoggedIn = true;
        this.token = this.auth.getToken();
        console.log('this.token :>> ', this.token);
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

  async searchEvents() {
    let research = this.search.value as string;
    research = research.toLowerCase();
    research = research.trim();
    const reg = /\s+/gm;
    research = research.replace(reg, "_");
    if (research == "") {
      research = "_";
    }
    else {
      if (this.lieu) {
        research = "1".concat(research);
      }
      else {
        research = "0".concat(research);
      }
      if (this.nom) {
        research = "1".concat(research);
      }
      else {
        research = "0".concat(research);
      }
    }
    this.router.navigate(['/search', research])  
      .then(() => {
        window.location.reload();
      });
  }
}