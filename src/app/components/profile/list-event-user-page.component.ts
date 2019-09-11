import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-list-event-user-page',
  templateUrl: './list-event-user-page.component.html',
  styleUrls: ['./list-event-user-page.component.css']
})

export class ListEventUserPageComponent implements OnInit {

  eventList;
  queryEvent;
  private AllEvents: string;

  constructor() {
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
}
