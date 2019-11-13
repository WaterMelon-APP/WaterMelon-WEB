import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  user = {} as User;

  username = "";
  _myName = "Lysa";
  _event = "Barbecue de rentrée";
  _place = "5 rue de Rome, 75018";
  _time = "22h00";
  _date = "03/09/2020";

  mail = "mailto:?subject=Nouvelle%20invitation%20!&body=Bonjour%2C%0ATu%20es%20invit%C3%A9(e)%20%C3%A0%20l'%C3%A9v%C3%A9nement%20" + this._event + "%20par%20" + this._myName + "%2C%20le%20" + this._date + "%20au%20" + this._place + "%20%C3%A0%20" + this._time + "%20!%0AEst-ce%20que%20%C3%A7a%20t'int%C3%A9resse%20%3F%2C%0A";

  constructor() { }

  ngOnInit() {
    // 1. get info from Event : title, date, time, place
    // 2. get info from User you wanna invite : name and email
  }

  invite() {

  }

}
