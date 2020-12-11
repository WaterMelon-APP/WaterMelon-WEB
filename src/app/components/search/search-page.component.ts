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
    /*
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    let search = this.route.snapshot.paramMap.get('id');
    const reg = /[_]+/m;
    search = search.replace(reg, " ");
    search = search.trim();
    if (search == " ") {
      search = "";
    }
    this.research = search;*/
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
    /*for (let event of eventList) {
      if (event.Owner == this.username) {
        console.log(event.Owner);
        this.eventList.push(event);
      }
    }

    /*
    let nom: boolean;
    let lieu: boolean;
    if (this.research.length > 2) {
      if (this.research[0] == '1') {
        nom = true;
      }
      else {
        nom = false;
      }
      if (this.research[1] == '1') {
        lieu = true;
      }
      else {
        lieu = false;
      }
      this.research = this.research.slice(2);
    }
    else if (this.research.length == 0) {
      nom = true;
      lieu = true;
    }
    else {
      nom = false;
      lieu = false;
    }


    this.http.get<Array<Event>>(this.auth.callEventsSearch(), this.header)
    .subscribe(eventResponse => {
        this.eventL = eventResponse;
      },
      error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );

    this.eventList = [];
    let i = 0;
    for (let event of this.eventL) {
      if (i >= 10) {
        break;
      }
      if (event.Owner != this.id && !this.isIn(event)) {
        let eventName = event.Name.toLowerCase();
        let eventPlace = event.Address;
        if (eventPlace) {
          eventPlace = eventPlace.toLowerCase();
        }
        if (nom && eventName.includes(this.research)) {
          this.eventList.push(event);
          ++i;
        }
        else if (lieu && eventPlace && eventPlace.includes(this.research)) {
          this.eventList.push(event);
          ++i;
        }
      }
    }
    */
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
    console.log(event);
    console.log(event.Guests);
    const memberList = '{ "Guests": ' + guestsList + '}';
    var jmemberList = JSON.parse(memberList);
    console.log('jevent :>> ', jmemberList);
    this.http.put<Event>(this.auth.callEvents(event.Id), jmemberList, this.header)
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
