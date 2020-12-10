import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service'
import { User } from '../../models/user.model'
import { Photo } from '../../models/photo.model'

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
  photo;
  header: Object;
  id: string;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.profileInit();
  }

  async profileInit() {
    this.http.get<User>(this.auth.callUsers(this.id), this.header)
      .subscribe(userResponse => {
        this.username = userResponse.Username;
        this.name = userResponse.LastName;
        this.surname = userResponse.FirstName;
        this.email = userResponse.Email;
        this.birthdate = new Date(userResponse.Birthdate);
        this.phone = userResponse.Phone;
        this.events = userResponse.Events;
        this.profile_picture = userResponse.ProfilePicture;
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
      this.http.get<Photo>(this.auth.callPhotoUser(this.id), this.header)
        .subscribe(photoResponse => {
          this.photo = photoResponse.Content;
        },
          error => {
            this.openSnackBar("Une erreur est survenue", "Fermer");
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

    const user = '{ "Id": "' + this.id + '", "Name": "' + fNameVal + '", "Username": "' + fUsernameVal + '", "Email": "' + fEmailVal + '", "FirstName": "' + fSurnameVal + '", "LastName": "' + fNameVal + '", "Phone": "' + fPhoneVal + '", "Birthdate": "' + this.birthdate.toISOString() + '", "ProfilePicture": "' + "" + '", "Events": ' + this.events + ' }';
    console.log('user :>> ', user);
    var juser = JSON.parse(user);

    this.http.put<User>(this.auth.callUsers(this.id), juser, this.header)
      .subscribe(userResponse => {
        this.openSnackBar('Les changements ont bien été enregistré !', "Fermer");
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

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }

  onSubmit() {
    const userId = this.id;
    const formData = new FormData();
    const image = {
      uri: this.uploadedFilePath,
      name: this.fileData.name,
      type: 'multipart/form-data',
      lenght: this.fileData.size,
      size: this.fileData.size,
      slice: this.fileData.slice
    }

    formData.append('UserId', userId);
    formData.append('File', image);

    this.http.post(this.auth.callUpload(), formData, this.header)
      .subscribe(res => {
        console.log(res);
        alert('SUCCESS !!');
      })
  }
}
