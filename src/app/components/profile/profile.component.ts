import * as Parse from 'parse';
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'

export interface UserResponse {
  Id: string;
  Name: string;
  Username: string;
  Password: string;
  Email: string;
  Token: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  Birthdate: Date;
  ProfilePicture: string;
  Events: Array<string>;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  fUsername = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fName = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fSurname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fEmail = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fBirthdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fPhone = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fLocal = new FormControl('', [Validators.required, Validators.requiredTrue]);
  //fWebsite = new FormControl('', [Validators.required, Validators.requiredTrue]);
  //fFacebook = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fBio = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fDate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  user;
  username;
  name;
  events;
  surname;
  email;
  bio;
  birthdate;
  localisation;
  website;
  facebook;
  phone;
  creation_date;
  profile_picture;
  header: Object;
  token: string;
  id: string;

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.token = this.auth.getToken();
    this.id = this.auth.getId();
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
    this.profileInit();
  }

  async profileInit() {
    this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.id, this.header)
    .subscribe(userResponse => {
      this.username = userResponse.Username;
      this.name = userResponse.Name;
      this.surname = userResponse.Name;
      this.email = userResponse.Email;
      this.birthdate = new Date(userResponse.Birthdate);
      this.phone = userResponse.Phone;
      this.events = userResponse.Events;
      this.bio = "";
      this.localisation = "";
      this.website = "";
      this.facebook = "";
      this.creation_date = "";
      this.profile_picture = userResponse.ProfilePicture;
    },
      error => { 
          alert("Une erreur est survenue");
      }
    );

    /*await this.query.get(this.currentSession.id)
    .then((userInfo) => {
      this.user = userInfo;
      this.username = userInfo.get('username');
      this.name = userInfo.get('lastName');
      this.surname = userInfo.get('firstName');
      this.email = userInfo.get('email');
      this.birthdate = userInfo.get('birthdate');
      this.phone = userInfo.get('phone');
      this.bio = userInfo.get('about');
      this.localisation = userInfo.get('localisation');
      this.website = userInfo.get('website');
      this.facebook = userInfo.get('facebook');
      this.creation_date = userInfo.get('createdAt');
      this.profile_picture = userInfo.get('profilPictureUrl');
    }, (error) => {
      console.log('oups');
    });*/
  }

  async postNewProfile() {
    let fUsernameVal = this.fUsername.value as string;
    if (fUsernameVal == null || fUsernameVal == "") {
      fUsernameVal = this.username;
    }
    let fNameVal = this.fName.value as string;
    if (fNameVal == null || fNameVal == "") {
      fNameVal = this.name;
    }
    let fSurnameVal = this.fSurname.value as string;
    if (fSurnameVal == null || fSurnameVal == "") {
      fSurnameVal = this.surname;
    }
    let fEmailVal = this.fEmail.value as string;
    if (fEmailVal == null || fEmailVal == "") {
      fEmailVal = this.email;
    }
    //let fBirthdateVal = new Date(this.fBirthdate.value);
    let fPhoneVal = this.fPhone.value as string;
    if (fPhoneVal == null || fPhoneVal == "") {
      fPhoneVal = this.phone;
    }
    let fBioVal = this.fBio.value as string;
    if (fBioVal == null || fBioVal == "") {
      fBioVal = this.bio;
    }
    let fLocalVal = this.fLocal.value as string;

    //console.log('fBi :', fBirthdateVal);
    console.log('fBioVal :', fBioVal);
    console.log('fSurnameVal :', fSurnameVal);
    /*if (fUsernameVal != null && fUsernameVal != "") {
      this.user.set('username', fUsernameVal);
    }
    if (fNameVal != null && fNameVal != "") {
      this.user.set('lastName', fNameVal);
    }
    if (fSurnameVal != null && fSurnameVal != "") {
      this.user.set('firstName', fSurnameVal);
    }
    if (fEmailVal != null && fEmailVal != "") {
      this.user.set('email', fEmailVal);
    }*/
    /*if (this.birthdate != null) {
      this.user.set('birthdate', this.birthdate);
    }*/
    /*if (fPhoneVal != null && fPhoneVal != "") {
      this.user.set('phone', fPhoneVal);
    }*/
    /*if (fBioVal != null && fBioVal != "") {
      this.user.set('about', fBioVal);
    }
    if (fLocalVal != null && fLocalVal != "") {
      this.user.set('localisation', fLocalVal);
    }*/

    const user = '{ "Id": "' + this.id + '", "Name": "' + fNameVal + '", "Username": "' + fUsernameVal + '", "Email": "' + fEmailVal + '", "FirstName": "' + fNameVal + '", "LastName": "' + fSurnameVal + '", "Phone": "' + fPhoneVal + '", "Birthdate": "' + this.birthdate.toISOString() + '", "ProfilePicture": "' + "" + '", "Events": ' + this.events + ' }';
    console.log('user :>> ', user);
    var juser = JSON.parse(user);

    this.http.put<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.id, juser, this.header)
    .subscribe(userResponse => {
          alert('Les changements ont bien été enregistré !');
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*this.user.save()
    .then(res => {
      alert("Les changements ont bien été enregistré !");
      location.reload();
    }, err => {
      alert(err);
    })*/
  }
}
