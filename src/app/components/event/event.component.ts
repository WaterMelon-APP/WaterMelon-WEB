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
  queryItem;
  priceNeeds;
  namesNeeds;
  quantNeeds;
  totalCost;
  payed;
  gived;
  isPrivate;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.queryNeeds = new Parse.Query('Needs');
    this.payed = new Array();
    this.gived = new Array();
    this.findEvent().then(() => {this.privateBand();})
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
        this.totalCost = 0;
        if (!this.needsEvent) {
          this.needsEvent = [];
        }
        for (let item of this.needsEvent)
        {
          await this.queryNeeds.get(item)
          .then(res => {
            this.itemList.push(res);
            this.payed[res.id] = false;
            if (res.get("Pay") != null && res.get("Pay")[0] != "") {
              this.payed[res.id] = true;
            }
            this.gived[res.id] = false;
            if (res.get("Give") != null && res.get("Give")[0] != "") {
              this.gived[res.id] = true;
            }
          }, err => {
            alert(err);
          })
        }
      }
    }
  }

  async createNeeds() {
    const needsnameVal = this.needsname.value as string;
    const needspriceVal = parseFloat(this.needsprice.value as string);
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

  async delItem(item){
    let a = 0;
    for (let i of this.needsEvent)
    {
      if (i == item.id) {
        this.needsEvent.splice(a, 1);
        break;
      }
      a = a + 1;
    }
    this.event.set('itemList', this.needsEvent);
    this.event.save()
    .then(res => {
      console.log('Maj item list');
    }, err=> {
      alert(err);
    });

    item.destroy().then((item) => {
      alert("L'item a bien été supprimé.");
      location.reload();
    }, (error) => {
      alert(error);
    });
  }

  async bringItem(item) {
    const user = Parse.User.current();
    let payTab = item.get("Pay");
    if (!payTab) {
      payTab = new Array();
    }
    let giveTab = item.get("Give");
    if (!giveTab) {
      giveTab = new Array();
    }

    if (this.payed[item.id] == true) {
      payTab[0] = user.id;
    }
    else {
      payTab[0] = "";
    }
    if (this.gived[item.id] == true) {
      giveTab[0] = user.id;
    }
    else {
      giveTab[0] = "";
    }
    item.set("Pay", payTab);
    item.set("Give", giveTab);
    item.save()
    .then(res => {
      console.log('Maj item list');
    }, err=> {
      alert(err);
    });
  }

  async privateBand()
  {
    const isPriv = this.event.get('isPrivate');
    const band = document.getElementById("grayBandPrivacy");
    if(isPriv == true)
    {
      band.style.visibility="visible";
      console.log("visible");
    }
    if(isPriv == false)
    {
      band.style.visibility="hidden";
      console.log("hidden");
    }
  }

}
