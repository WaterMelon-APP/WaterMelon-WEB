import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  header: Object;
  id: string;

  constructor(private router: Router, private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.EvenTListByUsr();
    this.createInviteList();
  }

  async createInviteList() {
    let invites: Array<Event>;
    invites = [];
    this.inviteList = [];

    this.http.get<Array<Event>>(this.auth.callEventsSearchfromuser(this.id), this.header)
    .subscribe(eventResponse => {
        invites = eventResponse;
      },
      error => { 
          alert("Une erreur est survenue");
      }
    );
    for (let invite of invites) {
      if (invite.Owner != this.id) {
        this.inviteList.push(invite);
      }
    }
  }

  async EvenTListByUsr() {
    let events: Array<Event>;
    events = [];
    this.eventList = [];

    this.http.get<Array<Event>>(this.auth.callEventsSearchfromuser(this.id), this.header)
    .subscribe(eventResponse => {
        this.eventList = eventResponse;
      },
      error => { 
          alert("Une erreur est survenue");
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
          alert("L'événement a bien été supprimé.");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
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
        alert("Vous avez quitté l'event");
        location.reload();
      },
      error => { 
        alert("Une erreur est survenue");
      }
    );
  }

  async editEvent(id) {
    this.router.navigate(['/event-edit', id])
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
