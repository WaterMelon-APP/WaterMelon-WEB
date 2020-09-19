import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  eventL: Array<Event>;
  header: Object;
  id: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private auth: AuthService) {
  }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    let search = this.route.snapshot.paramMap.get('id');
    const reg = /[_]+/m;
    search = search.replace(reg, " ");
    search = search.trim();
    if (search == " ") {
      search = "";
    }
    this.research = search;
    this.EventListPublic();
  }

  async EventListPublic() {
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
          alert("Une erreur est survenue");
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
    let memberL = event.Guests;
    memberL.push(this.id);
    const memberList = '{ "Guests": "' + memberL + '" }';
    var jmemberList = JSON.parse(memberList);

    this.http.put<Event>(this.auth.callEvents(event.Id), jmemberList, this.header)
    .subscribe(userResponse => {
          alert("Vous avez rejoint l'event");
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
