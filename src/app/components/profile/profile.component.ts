import * as Parse from 'parse';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';

import { UpdateProfileComponent } from '@components/update-profile/update-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentSession = Parse.User.current();
  query = new Parse.Query('User');
  username: string;
  name: string;
  surname: string;
  email: string;
  birthdate: Date;
  website: string;
  facebook: string;
  phone: string;
  creation_date: Date;
  profile_picture: string;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.query.get(this.currentSession.id)
    .then((userInfo) => {
      this.username = userInfo.get('username');
      this.name = userInfo.get('name');
      this.surname = userInfo.get('surname');
      this.email = userInfo.get('email');
      this.birthdate = userInfo.get('birthdate');
      this.phone = userInfo.get('phone');
      this.website = userInfo.get('website');
      this.facebook = userInfo.get('facebook');
      this.creation_date = userInfo.get('createdAt');
      this.profile_picture = userInfo.get('profilPictureUrl');

      // The object was retrieved successfully.
    }, (error) => {
      console.log('oups');
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    });
    console.log(this.currentSession);
  }

  postNewProfile() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(UpdateProfileComponent, dialogConfig);
  }
}
