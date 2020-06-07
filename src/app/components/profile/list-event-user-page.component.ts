import { Component, OnInit } from '@angular/core';

import * as Parse from 'parse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-event-user-page',
  templateUrl: './list-event-user-page.component.html',
  styleUrls: ['./list-event-user-page.component.css']
})

export class ListEventUserPageComponent implements OnInit {

  constructor(private router: Router) {}

    eventList;
    inviteList;

  ngOnInit() {
    this.EvenTListByUsr();
    this.createInviteList();
  }

  async createInviteList() {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    this.inviteList = [];
    var allEvent = await query.find();
    for (let event of allEvent) {
      if ((event.get("usersAdmin") && event.get("usersAdmin").includes(user.id))
      || (event.get("usersGuest") && event.get("usersGuest").includes(user.id))) {
        this.inviteList.push(event);
      }
    }
  }

  async EvenTListByUsr() {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();
  }

  async delEvent(id) {
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let item = await query.find();

    item[0].destroy().then((item) => {
      alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
      location.reload();
    }, (error) => {
      alert(error);
    });
  }

  async quitEvent(id) {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', id);
    let event = await query.find();

    let memberList = event[0].get('usersGuest');
    let adminList = event[0].get('usersAdmin');
    if (!memberList) {
      memberList = [];
    }
    if (!adminList) {
      adminList = [];
    }

    let a = 0;
    for (let i of memberList) {
      if (i == user.id) {
        memberList.splice(a, 1);
        break;
      }
      ++a;
    }
    a = 0;
    for (let i of adminList) {
      if (i == user.id) {
        adminList.splice(a, 1);
        break;
      }
      ++a;
    }

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
    })
  }

  async editEvent(id) {
    this.router.navigate(['/event-edit', id])
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
