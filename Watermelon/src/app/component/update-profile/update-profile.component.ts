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

  facebook = new FormControl('', [Validators.required, Validators.requiredTrue]);
  email = new FormControl('', [Validators.required, Validators.requiredTrue]);
  phone = new FormControl('', [Validators.required, Validators.requiredTrue]);
  birthdate = new FormControl('', [Validators.required, Validators.requiredTrue]);
  // phone = new FormControl('', [Validators.required, Validators.email]);
  // profilePicture = new FormControl('', [Validators.required, Validators.email]);
  // firstPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);
  // verifPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private dialogRef: MatDialogRef<UpdateProfileComponent>) { }
  datebirth;

  getErrorMessage() {
    console.log('oups');
  }

  ngOnInit() {
    this.datebirth = new Date();
  }

  async updateProfile() {
    /*const NewProfile = Parse.Object.extend('User');
    const newProfile = new NewProfile();

    newProfile.set('facebook', this.facebook);
    newProfile.set('email', this.email);
    newProfile.set('phone', this.phone);
    newProfile.set('birthdate', this.datebirth);
    // newProfile.set('profilePictureUrl', this.profilePicture);
    // newProfile.set('passeword', this.verifPasswd);

    newProfile.save()
      .then((newTrofile) => {
       // Execute any logic that should take place after the object is saved.
      alert('New object created with objectId: ' + newProfile.id);
    }, (error) => {
       // Execute any logic that should take place if the save fails.
       // error is a Parse.Error with an error code and message.
      alert('Failed to create new object, with error code: ' + error.message);
    });*/

    

    const facebookVal = this.facebook.value as string;
    const emailVal = this.email.value as string;
    const phoneVal = this.phone.value as string;
    const birthdateVal = this.datebirth;

    if (facebookVal != null || birthdateVal != null || emailVal != null || phoneVal != null) {
      var NewProfile = Parse.Object.extend('User');
      var newProfile = new NewProfile();
  
      newProfile.set('facebook', facebookVal);
      newProfile.set('email', emailVal);
      newProfile.set('phone', phoneVal);
      newProfile.set('birthdate', birthdateVal);
  
      newProfile.save()
      .then(res => {
        alert('Congratulations ! Your profile has been updated !');
        this.dialogRef.close();
      }, err => {
        alert(err);
      })
    }
  }
}
