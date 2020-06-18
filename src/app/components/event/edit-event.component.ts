import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'

export interface EventResponse {
  Id: string;
  Name: string;
  Owner: string;
  Date: Date;
  Address: string;
  Guests: Array<string>;
  Public: boolean;
  ItemList: Array<string>;
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})

export class EditEventComponent implements OnInit {

  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventaddress = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private route: ActivatedRoute, private http: HttpClient, private auth: AuthService) { }
  dateEvent;
  addressEvent;
  nameEvent;
  guestsEvent;
  itemEvent;

  eventId;
  eventList;
  queryEvent;
  event;
  isPublic;
  header: Object;
  token: string;
  id: string;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.token = this.auth.getToken();
    this.id = this.auth.getId();
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
    this.findEvent();
    this.getPrivacy();
  }

  async findEvent() {
    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, this.header)
    .subscribe(eventResponse => {
        this.dateEvent = new Date(eventResponse.Date);
        this.nameEvent = eventResponse.Name;
        this.isPublic = eventResponse.Public;
        this.addressEvent = eventResponse.Address;
        this.guestsEvent = eventResponse.Guests;
        this.itemEvent = eventResponse.ItemList;
        if (!this.addressEvent) {
          this.addressEvent = "Modifiez l'adresse"
        }
      },
      error => { 
          alert("Une erreur est survenue");
      }
    );
    /*
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
        this.isPublic = this.event.get('isPublic');
        this.addressEvent = this.event.get('address');
        if (!this.addressEvent) {
          this.addressEvent = "Modifiez l'adresse"
        }
      }
    }*/
  }

  async editName() {
    const eventnameVal = this.eventname.value as string;

    if (eventnameVal != null) {
      const name = '{ "Id": "' + this.eventId + '", "Name": "' + eventnameVal + '", "Owner": "' + this.id + '", "Date": "' + this.dateEvent.toISOString() + '", "Adress": "' + this.addressEvent + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jname = JSON.parse(name);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jname, this.header)
      .subscribe(eventResponse => {
          alert("Le nom a bien été changé à " + eventnameVal + " !");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );
      /*this.event.set('eventName', eventnameVal);
      this.event.save()
      .then(res => {
        alert("Le nom a bien été changé à " + eventnameVal + " !");
      }, err => {
        alert(err);
      })*/
    }
  }

  async editDate() {
    const eventdateVal = this.dateEvent;

    if (eventdateVal != null) {
      const date = '{ "Id": "' + this.eventId + '", "Name": "' + this.nameEvent + '", "Owner": "' + this.id + '", "Date": "' + eventdateVal.toISOString() + '", "Address": "' + this.addressEvent + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jdate = JSON.parse(date);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jdate, this.header)
      .subscribe(eventResponse => {
          alert("La date a bien été changé !");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );

      /*this.event.set('dateEvent', eventdateVal);
      this.event.save()
      .then(res => {
        alert('La date a bien été changé !');
      }, err => {
        alert(err);
      })*/
    }
  }

  async editAddress() {
    const eventaddressVal = this.eventaddress.value as string;

    if (eventaddressVal != null) {
      const address = '{ "Id": "' + this.eventId + '", "Name": "' + this.nameEvent + '", "Owner": "' + this.id + '", "Date": "' + this.dateEvent.toISOString() + '", "Address": "' + eventaddressVal + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jaddress = JSON.parse(address);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jaddress, this.header)
      .subscribe(eventResponse => {
          alert("L'adresse a bien été changé à " + eventaddressVal + " !");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );

      /*this.event.set('address', eventaddressVal);
      this.event.save()
      .then(res => {
        alert("L'addresse a bien été changé à " + eventaddressVal + " !");
      }, err => {
        alert(err);
      })*/
    }
  }

  clearGuests(guests) {
    console.log('guests :>> ', guests);
    let guestsList: string = '[';
    let a = 0;
    if (guests) {
      for (let guest of guests) {
        if (a) {
          guestsList = guestsList + ", ";
        }
        guestsList = guestsList + '"' + guest + '"';
        a = 1;
        console.log('guestsList :>> ', guestsList);
      }
    }
    guestsList = guestsList + "]";
    console.log('guestsList :>> ', guestsList);
    return (guestsList);
  }

  async getPrivacy() {
    const checkbox = document.getElementById('priv') as HTMLInputElement;

    checkbox.checked = this.isPublic;
  }

  async editPrivacy() {
    const checkbox = document.getElementById('priv') as HTMLInputElement;
    const ispublic = '{ "Id": "' + this.eventId + '", "Name": "' + this.nameEvent + '", "Owner": "' + this.id + '", "Date": "' + this.dateEvent.toISOString() + '", "Address": "' + this.addressEvent + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + checkbox.checked + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
    console.log('ispublic :>> ', ispublic);
    var jpublic = JSON.parse(ispublic);
    console.log('jpublic :>> ', jpublic);
    this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jpublic, this.header)
    .subscribe(eventResponse => {
      console.log('eventResponse :>> ', eventResponse);
        alert("L'événement a bien été modifié");
        location.reload();
      },
      error => { 
        alert("Une erreur est survenue");
      }
    );

    /*this.event.set('isPublic', false);
    this.event.save()
    .then(res => {
      alert("L'événement a bien été modifié");
    }, err=>{
      alert(err);
    })*/
  }
}
