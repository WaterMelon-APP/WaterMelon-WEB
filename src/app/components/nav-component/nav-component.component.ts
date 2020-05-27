import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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
  lieu = true;
  nom = true;
  token:string;
  id:string;

  constructor(public dialog: MatDialog, private router: Router, private data: LoginFormComponent) {
    this.data.currentToken.subscribe(token => this.token = token)
    this.data.currentId.subscribe(id => this.id = id)
    if (this.token) {
      this.isLoggedIn = true;
    }
  }

  search = new FormControl('', [Validators.required, Validators.requiredTrue]);

  signOut() {
    //Parse.User.logOut(); Modif token
    this.isLoggedIn = false;
  }

  ngOnInit() {
  }

  Login() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginFormComponent, dialogConfig).afterClosed().subscribe(() => {
      if (this.token) {
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