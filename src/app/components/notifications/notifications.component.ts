import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register/register-form.component';
import { CreateEventComponent } from '../event/create-event.component';
import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user.model'
import { Event } from '../../models/event.model'
import { Notification } from '../../models/notification.model'


@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

  header: Object;
  id: string;
  username;
  notificationList: Array<Notification>;
  notificationsList;
  eventNameList;

  constructor(public dialog: MatDialog, private router: Router, private auth: AuthService, private http: HttpClient, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.username = this.auth.getUsername();
    this.notificationsList = [];
    this.eventNameList = [];
    this.getNotifications();
  }

  async getNotifications() {
    this.http.get<Array<Notification>>(this.auth.callNotificationsTo(this.username), this.header)
      .subscribe(notificationResponse => {
        this.notificationList = notificationResponse;
        console.log('this.notificationList :>> ', this.notificationList);
        if (!this.notificationList) {
          this.notificationList = [];
        }
        for (let notification of this.notificationList) {
          this.http.get<Notification>(this.auth.callNotifications(notification.Id), this.header)
            .subscribe(notificationResponse => {
              let eventId = notificationResponse.EventId;

              this.http.get<Event>(this.auth.callEvents(eventId), this.header)
                .subscribe(eventResponse => {
                  this.eventNameList[notification.Id] = eventResponse.Name;
                })
            })
        }
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }

  async acceptInvite(notif) {
    this.http.post<String>(this.auth.callInvitationsAccept(notif.DataId), JSON.parse("{}"), this.header)
      .subscribe(response => {
        console.log('response :>> ', response);
        this.http.delete<String>(this.auth.callNotifications(notif.Id), this.header)
          .subscribe(response => {
            console.log('response :>> ', response);
          },
          error => {
            this.openSnackBar("Une erreur est survenue", "Fermer")
          })
        window.location.reload();
      },
      error => {
        this.openSnackBar("Une erreur est survenue", "Fermer");
      })
  }

  async refuseInvite(notif) {
    this.http.post<String>(this.auth.callInvitationsRefuse(notif.DataId), JSON.parse("{}"), this.header)
    .subscribe(response => {
      console.log('response :>> ', response);
      this.http.delete<String>(this.auth.callNotifications(notif.Id), this.header)
      .subscribe(response => {
        console.log('response :>> ', response);
      },
      error => {
        this.openSnackBar("Une erreur est survenue", "Fermer")
      })
    window.location.reload();
    },
    error => {
      this.openSnackBar("Une erreur est survenue", "Fermer");
    })
  }

  async validateNotif(notif) {
    this.http.delete<String>(this.auth.callNotifications(notif.Id), this.header)
    .subscribe(response => {
      console.log('response :>> ', response);
      window.location.reload();
    },
    error => {
      this.openSnackBar("Une erreur est survenue", "Fermer")
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
