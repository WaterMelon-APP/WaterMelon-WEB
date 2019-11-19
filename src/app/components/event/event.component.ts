import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  needsprice = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsquant = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  constructor(private route: ActivatedRoute, private router: Router) { }
  eventId;
  eventList;
  itemList;
  event;
  nameEvent;
  needsEvent;
  queryEvent;
  queryNeeds;
  priceNeeds;
  namesNeeds;
  quantNeeds;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.queryNeeds = new Parse.Query('Needs');
    this.findEvent();
    console.log('this.itemList :', this.itemList);
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
        this.needsEvent = this.event.get('itemList');
        if (!this.needsEvent) {
          this.needsEvent = [];
        }
        for (let item of this.needsEvent)
        {
          await this.queryNeeds.get(item)
          .then(res => {
            this.itemList.push(res);
          }, err => {
            alert(err);
          })
        }
      }
    }
  }

  async createNeeds() {
    const needsnameVal = this.needsname.value as string;
    const needspriceVal = parseInt(this.needsprice.value as string);
    const needsquantVal = parseInt(this.needsquant.value as string);

    if (needsnameVal != null && needspriceVal != null && needsquantVal != null) {
      var needs = Parse.Object.extend('Needs');
      var newNeed = new needs();

      newNeed.set('Name', needsnameVal);
      newNeed.set('Price', needspriceVal);
      newNeed.set('Quantity', needsquantVal);

      newNeed.save()
      .then(res => {
        this.needsEvent.push(newNeed.id);
        this.event.set('itemList', this.needsEvent);
        this.event.save()
        .then(res => {
          console.log('Maj item list');
        }, err=> {
          alert(err);
        })

        alert('Votre objet a été ajouté avec succès!');
        location.reload();
      }, err => {
        alert(err);
      })
    }
  }

  async delEvent() {
    const user = Parse.User.current();
    const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('Owner', user);
    this.eventList = await query.find();

    for (let item of this.eventList)
    {
      this.queryEvent = item.id;
      if (this.queryEvent == this.eventId) {
        item.destroy().then((item) => {
          alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
          this.router.navigate(['/list-user']);
        }, (error) => {
          alert(error);
        });
      }
    }
  }

  async editEvent() {
    this.router.navigate(['/event-edit', this.eventId])
  }
}
