import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { LoginFormComponent } from '@components/login-form/login-form.component';

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
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})

export class EditEventComponent implements OnInit {

  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventaddress = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private route: ActivatedRoute, private http: HttpClient, private data: LoginFormComponent) { }
  dateEvent;
  addressEvent;
  nameEvent;
  eventId;
  eventList;
  queryEvent;
  event;
  isPrivate;
  header;
  token:string;
  id:string;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.data.currentToken.subscribe(token => this.token = token)
    this.data.currentId.subscribe(id => this.id = id)
    this.findEvent();
  }

  async findEvent() {
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, this.header)
    .subscribe(eventResponse => {
        this.dateEvent = eventResponse.Date;
        this.nameEvent = eventResponse.Name;
        this.isPrivate = eventResponse.Public;
        this.addressEvent = eventResponse.Adress;
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
        this.isPrivate = this.event.get('isPrivate');
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
      const name = '{ "Name": "' + eventnameVal + '" }';
      var jname = JSON.parse(name);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jname, this.header)
      .subscribe(eventResponse => {
          alert("Le nom a bien été changé à " + eventnameVal + " !");
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
      const date = '{ "Date": "' + eventdateVal + '" }';
      var jdate = JSON.parse(date);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jdate, this.header)
      .subscribe(eventResponse => {
          alert("La date a bien été changé !");
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
      const address = '{ "Adress": "' + eventaddressVal + '" }';
      var jaddress = JSON.parse(address);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jaddress, this.header)
      .subscribe(eventResponse => {
          alert("L'adresse a bien été changé à " + eventaddressVal + " !");
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );

      /*this.event.set('address', eventaddressVal);
      this.event.save()
      .then(res => {
        alert("L'adresse a bien été changé à " + eventaddressVal + " !");
      }, err => {
        alert(err);
      })*/
    }
  }

  async getPrivacy() {
    const checkbox = document.getElementById('priv') as HTMLInputElement;

    if(this.isPrivate == true) {
      checkbox.checked = false;
    }
    if(this.isPrivate == false) {
      checkbox.checked = true;
    }
  }

  async editPrivacy() {
    const checkbox = document.getElementById('priv') as HTMLInputElement;
    if(checkbox.checked == true)
    {
      const ispublic = '{ "Public": "false" }';
      var jpublic = JSON.parse(ispublic);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jpublic, this.header)
      .subscribe(eventResponse => {
          alert("L'événement a bien été modifié");
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );

      /*this.event.set('isPrivate', false);
      this.event.save()
      .then(res => {
        alert("L'événement a bien été modifié");
      }, err=>{
        alert(err);
      })*/
      checkbox.checked = true;
    }
    else if (checkbox.checked == false)
    {
      const ispublic = '{ "Public": "true" }';
      var jpublic = JSON.parse(ispublic);
      this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jpublic, this.header)
      .subscribe(eventResponse => {
          alert("L'événement a bien été modifié");
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );

      /*this.event.set('isPrivate', true);
      this.event.save()
      .then(res => {
        alert("L'événement a bien été modifié");
      }, err=>{
        alert(err);
      })*/
      checkbox.checked = false;
    }
  }
}
