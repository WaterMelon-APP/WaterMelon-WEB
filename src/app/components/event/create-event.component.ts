import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  eventname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  dateEvent;
  header: Object;
  id: string;

  constructor(private dialogRef: MatDialogRef<CreateEventComponent>, private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.dateEvent = new Date();
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
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

      this.http.post<Event>(this.auth.callEvents(""), jevent, this.header)
      .subscribe(itemResponse => {
        alert('Votre événement a été créé avec succès!');
          console.log('itemResponse :>> ', itemResponse);
          this.dialogRef.close();
        },
        error => { 
          alert("Une erreur est survenue");
        }
      );
    }
  }
}