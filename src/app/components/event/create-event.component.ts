import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as Parse from 'parse';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'
import { getServers } from 'dns';

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
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  constructor(private dialogRef: MatDialogRef<CreateEventComponent>, private http: HttpClient, private auth: AuthService) { }
  dateEvent;
  header: Object;
  token: string;
  id: string;

  ngOnInit() {
    this.dateEvent = new Date();
    this.token = this.auth.getToken();
    this.id = this.auth.getId();
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
  }

  async createEvent() {
    const eventnameVal = this.eventname.value as string;
    const eventdateVal = this.dateEvent;
    const checkbox = document.getElementById('privCreate') as HTMLInputElement;
    let guests = [];
    guests.push(this.id);


    if (eventnameVal != null ||  eventdateVal != null) {
      const event = '{ "Name": "' + eventnameVal + '", "Owner": "' + this.id + '", "Date": "' + eventdateVal.toISOString() + '", "Adress": "' + "" + '", "Guests": ["' + guests + '"], "Public": "' + !checkbox.checked + '", "ItemList": ' + "[]" +  ' }';
      var jevent = JSON.parse(event);
      console.log('jevent :>> ', jevent);

      this.http.post<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events", jevent, this.header)
      .subscribe(itemResponse => {
            alert('Votre événement a été créé avec succès!');
            console.log('itemResponse :>> ', itemResponse);
            this.dialogRef.close();
          },
          error => { 
            alert("Une erreur est survenue");
        }
      );

      /*var event = Parse.Object.extend('Event');
      var newEvent = new event();
      newEvent.set('Owner', Parse.User.current());
      newEvent.set('eventName', eventnameVal);
      newEvent.set('dateEvent', eventdateVal);
      newEvent.set('isPrivate', checkbox.checked);
      newEvent.save()
        .then(res => {
          alert('Votre événement a été créé avec succès!');
          this.dialogRef.close();
        }, err => {
          alert(err);
        })*/
    }
  }
}