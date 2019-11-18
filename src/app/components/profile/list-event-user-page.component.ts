import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as Parse from 'parse';

@Component({
  selector: 'app-list-event-user-page',
  templateUrl: './list-event-user-page.component.html',
  styleUrls: ['./list-event-user-page.component.css']
})

export class ListEventUserPageComponent implements OnInit {

  eventList;
  queryEvent;
  private AllEvents: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.EvenTListByUsr();
  }

  async EvenTListByUsr() {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();

    for (let item of this.eventList)
    {
      this.queryEvent = item.get('eventName');
    }
  }

  async delEvent(id) {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();

    for (let item of this.eventList)
    {
      this.queryEvent = item.id;
      if (this.queryEvent == id) {
        item.destroy().then((item) => {
          alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
          location.reload();
        }, (error) => {
          alert(error);
        });
      }
    }
  }

  async editEvent(id) {
    this.router.navigate(['/event-edit', id])
  }

  async goToEvent(id) {
    this.router.navigate(['/event', id])
  }
}
