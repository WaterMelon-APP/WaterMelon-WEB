import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'
import * as Parse from 'parse';
import { Router } from '@angular/router';

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
  selector: 'app-list-event-user-page',
  templateUrl: './list-event-user-page.component.html',
  styleUrls: ['./list-event-user-page.component.css']
})

export class ListEventUserPageComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private auth: AuthService) {}

  eventList;
  inviteList;
  header: Object;
  token: string;
  id: string;

  ngOnInit() {
    this.token = this.auth.getToken();
    this.id = this.auth.getId();
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
    this.EvenTListByUsr();
    this.createInviteList();
  }

  /*-----------
  A modifier invitations
  -----------*/
  async createInviteList() {
    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/searchfromuser/" + this.id, this.header)
    .subscribe(eventResponse => {
        this.inviteList = eventResponse;
      },
      error => { 
          alert("Une erreur est survenue");
      }
    );

    /*const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    this.inviteList = [];
    var allEvent = await query.find();
    for (let event of allEvent) {
      if ((event.get("usersAdmin") && event.get("usersAdmin").includes(user.id))
      || (event.get("usersGuest") && event.get("usersGuest").includes(user.id))) {
        this.inviteList.push(event);
      }
    }*/
  }

  async EvenTListByUsr() {
    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/searchfromuser/" + this.id, this.header)
    .subscribe(eventResponse => {
        this.inviteList = eventResponse;
      },
      error => { 
          alert("Une erreur est survenue");
      }
    );

    /*const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();*/
  }

  async delEvent(id) {
    this.http.delete("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + id, this.header)
    .subscribe(userResponse => {
          alert("L'événement a bien été supprimé.");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let item = await query.find();

    item[0].destroy().then((item) => {
      alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
      location.reload();
    }, (error) => {
      alert(error);
    });*/
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

    const guest = '{ "Guests": "' + memberList + /*'", "Admins": "' + adminList +*/ '" }';
    var jguest = JSON.parse(guest);
    this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + event.Id, jguest, this.header)
    .subscribe(eventResponse => {
        alert("Vous avez quitté l'event");
        location.reload();
      },
      error => { 
        alert("Une erreur est survenue");
      }
    );

    /*const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let event = await query.find();


    event[0].set('usersGuest', memberList);
    event[0].save()
    .then(res => {
      console.log("Membre supprimé de l'event");
    }, err=> {
      alert(err);
    })
    event[0].set('usersAdmin', adminList);
    event[0].save()
    .then(res => {
      console.log("Admin supprimé de l'event");
      alert("Vous avez quitté l'event");
      location.reload();
    }, err=> {
      alert(err);
    })*/
  }

  async editEvent(id) {
    this.router.navigate(['/event-edit', id])
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
