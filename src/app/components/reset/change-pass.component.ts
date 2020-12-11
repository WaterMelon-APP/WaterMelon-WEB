import { Component, OnInit, Input } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent {
  hide = true;
  new_pass = new FormControl('', [Validators.required, Validators.requiredTrue]);
  user: User;
  header: Object;
  id: string;

  constructor(private router: Router, private _snackBar: MatSnackBar, private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
    this.profileInit();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async profileInit() {

    this.http.get<User>(this.auth.callUsers(this.id), this.header)
      .subscribe(userResponse => {
        this.user = userResponse;
        console.log('this.user :>> ', this.user);
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }

  async send() {
    const passwordVal = this.new_pass.value as string;
    const user = '{ "Password": "' + passwordVal + '", "Name": "' + this.user.Name + '", "Username": "' + this.user.Username + '", "Email": "' + this.user.Email + '", "FirstName": "' + this.user.FirstName + '", "LastName": "' + this.user.LastName + '", "Phone": "' + this.user.Phone + '", "Birthdate": "' + this.user.Birthdate + '", "ProfilePicture": "' + "" + '", "Events": ' + this.user.Events + ' }';
    var juser = JSON.parse(user);
    console.log('juser :>> ', juser);

    this.http.put<User>(this.auth.callUsers(this.id), juser, this.header)
      .subscribe(userResponse => {
        this.openSnackBar('Les changements ont bien été enregistré !', "Fermer");
        this.router.navigate(['/']);
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }
}