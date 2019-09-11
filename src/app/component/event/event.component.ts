import { Component, OnInit } from '@angular/core';

import { Event } from './../../Model/Event';

@Component({
    selector: 'event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
  })
  export class EventComponent implements OnInit {
    event: Event;

    ngOnInit() {
        this.event = new Event();
    }
}
