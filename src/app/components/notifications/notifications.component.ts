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
  type;
  from;
  eventId;
  eventName;

  constructor(public dialog: MatDialog, private router: Router, private auth: AuthService, private http: HttpClient) {
  }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.username = this.auth.getUsername();
    this.notificationsList = [];
    this.getNotifications();
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
            .subscribe(notificationResponse => {
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
