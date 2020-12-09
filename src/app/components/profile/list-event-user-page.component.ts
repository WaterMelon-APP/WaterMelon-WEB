import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'

@Component({
  selector: 'app-list-event-user-page',
  templateUrl: './list-event-user-page.component.html',
  styleUrls: ['./list-event-user-page.component.css']
})

export class ListEventUserPageComponent implements OnInit {

  eventList;
  inviteList;
  username: string;
  header: Object;
  id: string;

  constructor(private router: Router, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.username = this.auth.getUsername();
    this.EventListByUsr();
    this.createInviteList();
  }

  async createInviteList() {
    let invites: Array<Event>;
    invites = [];
    this.inviteList = [];

    this.http.get<Array<Event>>(this.auth.callEventsSearchfromuser(this.username), this.header)
    .subscribe(eventResponse => {
        invites = eventResponse;
      },
      error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
    for (let invite of invites) {
      if (invite.Owner != this.id) {
        this.inviteList.push(invite);
      }
    }
  }

  async EventListByUsr() {
    let events: Array<Event>;
    events = [];
    this.eventList = [];
    console.log('object :>> ', this.auth.callEventsSearchfromuser(this.username));
    this.http.get<Array<Event>>(this.auth.callEventsSearchfromuser(this.username), this.header)
    .subscribe(eventResponse => {
        this.eventList = eventResponse;
      },
      error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
    for (let event of events) {
      if (event.Owner == this.id) {
        this.eventList.push(event);
      }
    }
  }

  async delEvent(id) {
    this.http.delete(this.auth.callEvents(id), this.header)
    .subscribe(userResponse => {
          this.openSnackBar("L'événement a bien été supprimé.", "Fermer");
          location.reload();
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
  }

  clearGuests(guests) {
    let guestsList: string = '[';
    let a = 0;
    if (guests) {
      for (let guest of guests) {
        if (a) {
          guestsList = guestsList + ", ";
        }
        guestsList = guestsList + '"' + guest + '"';
        a = 1;
      }
    }
    guestsList = guestsList + "]";
    return (guestsList);
  }

  /*-----------
  A modifier admin
  -----------*/
  async quitEvent(event) {
    let memberList = event.Guests;
    //let adminList = event.Admins;
    if (!memberList) {
      memberList = [];
    }
    /*if (!adminList) {
      adminList = [];
    }*/

    let a = 0;
    for (let i of memberList) {
      if (i == this.id) {
        memberList.splice(a, 1);
        break;
      }
      ++a;
    }
    /*a = 0;
    for (let i of adminList) {
      if (i == this.id) {
        adminList.splice(a, 1);
        break;
      }
      ++a;
    }*/

    const guest = '{ "Guests": "' + this.clearGuests(memberList) + /*'", "Admins": "' + adminList +*/ '" }';
    var jguest = JSON.parse(guest);
    this.http.put<Event>(this.auth.callEvents(event.Id), jguest, this.header)
    .subscribe(eventResponse => {
        this.openSnackBar("Vous avez quitté l'event", "Fermer");
        location.reload();
      },
      error => {
        this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
  }

  async editEvent(id) {
    this.router.navigate(['/event-edit', id])
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
