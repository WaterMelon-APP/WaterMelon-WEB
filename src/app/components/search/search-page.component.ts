import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { LoginFormComponent } from '@components/login-form/login-form.component';
import * as Parse from 'parse';
import { isIdentifier } from '@angular/compiler';

export interface EventResponse {
  Id: string;
  Name: string;
  Owner: string;
  Date: Date;
  Adress: string;
  Guests: Array<string>;
  Public: boolean;
  ItemList: Array<string>;
}

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})

export class SearchComponent implements OnInit {

  eventList;
  research;
  eventL;
  user;
  header;
  token:string;
  id:string;


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private data: LoginFormComponent) {
  }

  ngOnInit() {
    this.data.currentToken.subscribe(token => this.token = token)
    this.data.currentId.subscribe(id => this.id = id)
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
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


    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/search/", this.header)
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
    /*const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('isPrivate', false);
    let eventL = await query.find();
    this.eventList = [];
    let i = 0;
    for (let event of eventL) {
      if (i >= 10) {
        break;
      }
      if (event.get("Owner").id != this.id && !this.isIn(event)) {
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
        }*/

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
    const memberList = '{ "Guests": "' + this.memberList + '" }';
    var jmemberList = JSON.parse(memberList);

    this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + event.Id, jmemberList, this.header)
    .subscribe(userResponse => {
          alert("Vous avez rejoint l'event");
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let event = await query.find();

    let memberList = event[0].get('usersGuest');
    if (!memberList) {
      memberList = [];
    }
    memberList.push(this.id);

    event[0].set('usersGuest', memberList);
    event[0].save()
    .then(res => {
      console.log("Membre ajouté à l'event");
      alert("Vous avez rejoint l'event");
    }, err=> {
      alert(err);
    })*/
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
