import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventaddress = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  constructor(private route: ActivatedRoute) { }
  dateEvent;
  addressEvent;
  nameEvent;
  eventId;
  eventList;
  queryEvent;
  event;

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
        this.dateEvent = this.event.get('dateEvent');
        this.nameEvent = this.event.get('eventName');
        this.addressEvent = this.event.get('address');
        if (!this.addressEvent) {
          this.addressEvent = "Modifiez l'adresse"
        }
      }
    }
  }

  async editName() {
    const eventnameVal = this.eventname.value as string;

    if (eventnameVal != null) {
      this.event.set('eventName', eventnameVal);
      this.event.save()
      .then(res => {
        alert("Le nom a bien été changé à " + eventnameVal + " !");
      }, err => {
        alert(err);
      })
    }
  }

  async editDate() {
    const eventdateVal = this.dateEvent;

    if (eventdateVal != null) {
      this.event.set('dateEvent', eventdateVal);
      this.event.save()
      .then(res => {
        alert('La date a bien été changé !');
      }, err => {
        alert(err);
      })
    }
  }

  async editAddress() {
    const eventaddressVal = this.eventaddress.value as string;

    if (eventaddressVal != null) {
      this.event.set('address', eventaddressVal);
      this.event.save()
      .then(res => {
        alert("L'adresse a bien été changé à " + eventaddressVal + " !");
      }, err => {
        alert(err);
      })
    }
  }
}
