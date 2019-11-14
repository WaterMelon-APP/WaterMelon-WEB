import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  constructor(private dialogRef: MatDialogRef<CreateEventComponent>) { }
  dateEvent;

  ngOnInit() {
    this.dateEvent = new Date();
  }

  async createEvent() {
    const eventnameVal = this.eventname.value as string;
    const eventdateVal = this.dateEvent;

    if (eventnameVal != null || eventdateVal != null) {
      var event = Parse.Object.extend('Event');
      var newEvent = new event();

      newEvent.set('Owner', Parse.User.current());
      newEvent.set('eventName', eventnameVal);
      newEvent.set('dateEvent', eventdateVal);

      newEvent.save()
      .then(res => {
        alert('Votre événement a été créé avec succès!');
        this.dialogRef.close();
      }, err => {
        alert(err);
      })
    }
  }
}
