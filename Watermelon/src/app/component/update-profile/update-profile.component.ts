import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  hide = true;

  facebook = new FormControl('');
  // email = new FormControl('', [Validators.required, Validators.email]);
  // phone = new FormControl('', [Validators.required, Validators.email]);
  // profilePicture = new FormControl('', [Validators.required, Validators.email]);
  // firstPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);
  // verifPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private dialogRef: MatDialogRef<UpdateProfileComponent>) { }

  ngOnInit() {
  }

  async updateProfile() {
    const NewProfile = Parse.Object.extend('User');
    const newProfile = new NewProfile();

    newProfile.set('facebook', this.facebook);
    // newProfile.set('emailVerified', this.email);
    // newProfile.set('phone', this.phone);
    // newProfile.set('profilePictureUrl', this.profilePicture);
    // newProfile.set('passeword', this.verifPasswd);

    newProfile.save();
    //   .then((newTrofile) => {
    //   // Execute any logic that should take place after the object is saved.
    //   alert('New object created with objectId: ' + newProfile.id);
    // }, (error) => {
    //   // Execute any logic that should take place if the save fails.
    //   // error is a Parse.Error with an error code and message.
    //   alert('Failed to create new object, with error code: ' + error.message);
    // });
  }

  getErrorMessage() {
    console.log('oups');
  }
}
