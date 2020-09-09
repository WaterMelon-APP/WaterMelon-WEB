import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user.model'

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
  //fLocal = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fBio = new FormControl('', [Validators.required, Validators.requiredTrue]);
  fDate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  username;
  name;
  events;
  surname;
  email;
  bio;
  birthdate;
  phone;
  creation_date;
  profile_picture;
  header: Object;
  id: string;

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.profileInit();
  }

  async profileInit() {
    this.http.get<User>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.id, this.header)
    .subscribe(userResponse => {
      this.username = userResponse.Username;
      this.name = userResponse.Name;
      this.surname = userResponse.Name;
      this.email = userResponse.Email;
      this.birthdate = new Date(userResponse.Birthdate);
      this.phone = userResponse.Phone;
      this.events = userResponse.Events;
      this.profile_picture = userResponse.ProfilePicture;
    },
      error => { 
          alert("Une erreur est survenue");
      }
    );
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
    let fPhoneVal = this.fPhone.value as string;
    if (fPhoneVal == null || fPhoneVal == "") {
      fPhoneVal = this.phone;
    }
    let fBioVal = this.fBio.value as string;
    if (fBioVal == null || fBioVal == "") {
      fBioVal = this.bio;
    }
    //let fLocalVal = this.fLocal.value as string;

    console.log('fBioVal :', fBioVal);
    console.log('fSurnameVal :', fSurnameVal);

    const user = '{ "Id": "' + this.id + '", "Name": "' + fNameVal + '", "Username": "' + fUsernameVal + '", "Email": "' + fEmailVal + '", "FirstName": "' + fNameVal + '", "LastName": "' + fSurnameVal + '", "Phone": "' + fPhoneVal + '", "Birthdate": "' + this.birthdate.toISOString() + '", "ProfilePicture": "' + "" + '", "Events": ' + this.events + ' }';
    console.log('user :>> ', user);
    var juser = JSON.parse(user);

    this.http.put<User>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.id, juser, this.header)
    .subscribe(userResponse => {
          alert('Les changements ont bien été enregistré !');
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );
  }
}
