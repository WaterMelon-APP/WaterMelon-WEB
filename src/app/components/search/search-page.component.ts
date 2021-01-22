import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})

export class SearchComponent implements OnInit {

  eventList;
  research;
  username;
  eventL: Array<Event>;
  header: Object;
  id: string;
  visibilityList: Array<boolean> = [];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.username = this.auth.getUsername();
    this.EventListPublic();
  }

  async EventListPublic() {
    let events: Array<Event>;
    let today = new Date();
    formatDate(today, 'yyyy-MM-dd', 'en');
    events = [];
    this.eventList = [];
    console.log('object :>> ', this.auth.callEventsSearch());
    this.http.get<Array<Event>>(this.auth.callEventsSearch(), this.header)
      .subscribe(eventResponse => {
        for (let events of eventResponse) {
          if (events.Owner != this.username) {
            if (events.Public == true) {
                this.eventList.push(events);
                this.visibilityList.push(true);
            }
          }
        }
        console.log(this.eventList);
        console.log(this.visibilityList);
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    for (let event of this.eventList) {
      if (event.Owner == this.id) {
        this.eventList.push(event);
      }
    }
  }

  isIn(event) {
    let memberList = event.Guests;
    let adminList = event.Admins;
    if (memberList) {
      for (let u of memberList) {
        if (this.id == u) {
          return true;
        }
      }
    }
    if (adminList) {
      for (let u of adminList) {
        if (this.id == u) {
          return true;
        }
      }
    }
    return false;
  }

  async joinEvent(event) {
    let guestsList: string = '[';
    let a = 0;
    event.Guests.push(this.username);
    if (event.Guests) {
      for (let guest of event.Guests) {
        if (a) {
          guestsList = guestsList + ", ";
        }
        guestsList = guestsList + '"' + guest + '"';
        a = 1;
        console.log('guestsList :>> ', guestsList);
      }
    }
    guestsList = guestsList + "]";
    console.log('guestsList :>> ', guestsList);
    console.log("here", event);
    console.log("here2", event.Guests);
    const memberList = '{ "guestname": "' + this.username + '" }';
    var jmemberList = JSON.parse(memberList);
    console.log('jevent :>> ', jmemberList);
    this.http.post<Event>(this.auth.callAddMember(event.Id), jmemberList, this.header)
      .subscribe(userResponse => {
        this.openSnackBar("Vous avez rejoint l'event", "Fermer");
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  hideEvent(i: number): void {
    this.visibilityList[i] = false;
  }
}
