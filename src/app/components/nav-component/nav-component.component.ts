import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register/register-form.component';
import { CreateEventComponent } from '../event/create-event.component';
import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user.model'
import { Event } from '../../models/event.model'
import { Notification} from '../../models/notification.model'


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
  header: Object;
  id: string;
  username;
  notificationList: Array<Notification>;
  notificationsList;
  type;
  from;
  eventId;
  eventName;

  constructor(public dialog: MatDialog, private router: Router, private auth: AuthService, private http: HttpClient) {
    this.token = this.auth.getToken();
    console.log('this.token :>> ', this.token);
    if (this.token) {
      this.isLoggedIn = true;
    }
  }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.username = this.auth.getUsername();
    this.notificationsList = [];
  }

  search = new FormControl('', [Validators.required, Validators.requiredTrue]);

  signOut() {
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
  async getNotifications() {
    this.http.get<Array<Notification>>(this.auth.callNotificationsTo(this.username), this.header)
      .subscribe(notificationResponse => {
        this.notificationList = notificationResponse;
        if (!this.notificationList) {
          this.notificationList = [];
        }
        for (let notification of this.notificationList) {
          this.http.get<Notification>(this.auth.callNotifications(notification.Id), this.header)
          .subscribe(notificationResponse =>{
            this.notificationsList.push(notificationResponse);
            this.type = notificationResponse.Type;
            this.from = notificationResponse.From;
            this.eventId = notificationResponse.EventId;

            this.http.get<Event>(this.auth.callEvents(this.eventId), this.header)
            .subscribe(eventResponse => {
              this.eventName = eventResponse.Name;
            })
          })
        }
      },
        error => {
          alert("Une erreur est survenue");
        }
      );
  }
}
