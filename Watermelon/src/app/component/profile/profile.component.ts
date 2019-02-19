import * as Parse from 'parse';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentSession = Parse.User.current();
  query = new Parse.Query('User');
  username: string;
  email: string;
  facebook: string;
  creation_date: Date;

  constructor() { }

  ngOnInit() {
    this.query.get(this.currentSession.id)
    .then((userInfo) => {
      this.username = userInfo.get('username');
      this.email = userInfo.get('email');
      this.facebook = userInfo.get('facebook');
      this.creation_date = userInfo.get('createdAt');

      // The object was retrieved successfully.
    }, (error) => {
      console.log('oups');
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    });
    console.log(this.currentSession);
  }

  postNewFacebook() {
    const NewProfile = Parse.Object.extend('NewProfile');
    const newProfile = new NewProfile();

    newProfile.set('facebook', 'Test2');

    newProfile.save()
    .then((gameScore) => {
      // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + gameScore.id);
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });
  }
}
