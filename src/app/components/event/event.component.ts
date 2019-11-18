import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  eventId;
  eventList;
  event;
  nameEvent;
  queryEvent;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.findEvent();
  }

  async findEvent() {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();

    for (let item of this.eventList)
    {
      this.queryEvent = item.id;
      if (this.queryEvent == this.eventId) {
        this.event = item;
        this.nameEvent = this.event.get('eventName');
      }
    }
  }
}
