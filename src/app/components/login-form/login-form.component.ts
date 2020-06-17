import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { User } from '@models/user';

export interface LogResponse {
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
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
  private tokenSource = new BehaviorSubject<string>("");
  private idSource = new BehaviorSubject<string>("");
  currentToken = this.tokenSource.asObservable();
  currentId = this.idSource.asObservable();


  hide = true;

  user = {} as User;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private dialogRef: MatDialogRef<LoginFormComponent>, private http: HttpClient) { }

  getErrorMessage() {

  }

  ngOnInit() {
  }

  async login(user: User) {
    const emailVal = this.email.value as string;
    const passwordVal = this.password.value as string;
    if (emailVal != null || passwordVal != null) {
      
      const header: Object = {
        headers: new HttpHeaders({
            Accept: 'application/json',
            'Content-Type':  'application/json'
        })
      };
      const user = '{ "Username": "' + emailVal + '", "Password": "' + passwordVal + '" }';
      var juser = JSON.parse(user);
      console.log('juser :>> ', juser);
      this.http.post<LogResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/login", juser, header)
      .subscribe(logResponse => {
          this.tokenSource.next(logResponse.Token);
          this.idSource.next(logResponse.Id);
        },
        error => { 
            alert("Une erreur est survenue");
        }
      );
      /*Parse.User.logIn(emailVal, passwordVal)
        .then(res => {
          this.dialogRef.close();

        }, err => {
          console.log(err);
          console.log(err.code);
          let msg;
          switch (err.code) {
            case 101:
              msg = 'Email or Password is wrong.';
              break;

            case 200:
              msg = 'Username/email is required.';
              break;

            default:
              msg = 'Something goes wrong';
              break;

          }
          alert(msg);
        });*/

    }
  }
}
