import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})

export class EditEventComponent implements OnInit {

  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventaddress = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  dateEvent;
  addressEvent;
  nameEvent;
  guestsEvent;
  itemEvent;

  eventId;
  isPublic;
  header: Object;
  id: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.findEvent();
    this.getPrivacy();
  }

  async findEvent() {
    this.http.get<Event>(this.auth.callEvents(this.eventId), this.header)
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
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
  }

  async editName() {
    const eventnameVal = this.eventname.value as string;

    if (eventnameVal != null) {
      const name = '{ "Id": "' + this.eventId + '", "Name": "' + eventnameVal + '", "Owner": "' + this.id + '", "Date": "' + this.dateEvent.toISOString() + '", "Adress": "' + this.addressEvent + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jname = JSON.parse(name);
      this.http.put<Event>(this.auth.callEvents(this.eventId), jname, this.header)
      .subscribe(eventResponse => {
        const text="Le nom a bien été changé à " + eventnameVal + " !";
          this.openSnackBar(text, "Fermer");
          location.reload();
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
  }

  async editDate() {
    const eventdateVal = this.dateEvent;

    if (eventdateVal != null) {
      const date = '{ "Id": "' + this.eventId + '", "Name": "' + this.nameEvent + '", "Owner": "' + this.id + '", "Date": "' + eventdateVal.toISOString() + '", "Address": "' + this.addressEvent + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jdate = JSON.parse(date);
      this.http.put<Event>(this.auth.callEvents(this.eventId), jdate, this.header)
      .subscribe(eventResponse => {
          this.openSnackBar("La date a bien été changé !", "Fermer");
          location.reload();
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
  }

  async editAddress() {
    const eventaddressVal = this.eventaddress.value as string;

    if (eventaddressVal != null) {
      const address = '{ "Id": "' + this.eventId + '", "Name": "' + this.nameEvent + '", "Owner": "' + this.id + '", "Date": "' + this.dateEvent.toISOString() + '", "Address": "' + eventaddressVal + '", "Guests": ' + this.clearGuests(this.guestsEvent) + ', "Public": ' + this.isPublic + ', "ItemList": ' + this.clearGuests(this.itemEvent) + ' }';
      var jaddress = JSON.parse(address);
      this.http.put<Event>(this.auth.callEvents(this.eventId), jaddress, this.header)
      .subscribe(eventResponse => {
        const text= "L'adresse a bien été changé à " + eventaddressVal + " !";
          this.openSnackBar(text, "Fermer");
          location.reload();
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
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
    this.http.put<Event>(this.auth.callEvents(this.eventId), jpublic, this.header)
    .subscribe(eventResponse => {
      console.log('eventResponse :>> ', eventResponse);
        this.openSnackBar("L'événement a bien été modifié", "Fermer");
        location.reload();
      },
      error => {
        this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
