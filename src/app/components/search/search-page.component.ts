import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as Parse from 'parse';
import { isIdentifier } from '@angular/compiler';

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})

export class SearchComponent implements OnInit {

  eventList;
  research;
  user;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
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

    this.user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('isPrivate', false);
    let eventL = await query.find();
    this.eventList = [];
    let i = 0;
    for (let event of eventL) {
      if (i >= 10) {
        break;
      }
      if (event.get("Owner").id != this.user.id && !this.isIn(event)) {
        let eventName = event.get("eventName").toLowerCase();
        let eventPlace = event.get("address");
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
    let memberList = event.get('usersGuest');
    let adminList = event.get('usersAdmin');
    if (memberList) {
      for (let u of memberList) {
        if (this.user.id == u) {
          return true;
        }
      }
    }
    if (adminList) {
      for (let u of adminList) {
        if (this.user.id == u) {
          return true;
        }
      }
    }
    return false;
  }

  async joinEvent(id) {
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let event = await query.find();

    let memberList = event[0].get('usersGuest');
    if (!memberList) {
      memberList = [];
    }
    memberList.push(this.user.id);

    event[0].set('usersGuest', memberList);
    event[0].save()
    .then(res => {
      console.log("Membre ajouté à l'event");
      alert("Vous avez rejoint l'event");
    }, err=> {
      alert(err);
    })
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
