import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service'

export interface RegResponse {
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

@Component ({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.css']
})

export class RegisterFormComponent implements OnInit {
    hide = true;

    user = {} as User;
    username = new FormControl('', [Validators.required, Validators.requiredTrue])
    email = new FormControl('', [Validators.required, Validators.email]);
    firstPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);
    verifPasswd = new FormControl('', [Validators.required, Validators.requiredTrue]);

    constructor(private dialogRef: MatDialogRef<RegisterFormComponent>, private http: HttpClient, private auth: AuthService) { }

    ngOnInit() {
    }

    getErrorMessage() {
    }

    async register(user: User) {
        const usernameVal = this.username.value as string;
        const emailVal = this.email.value as string;
        const firstPasswdVal = this.firstPasswd.value as string;
        const verifPasswdVal = this.verifPasswd.value as string;
        if (usernameVal != null || emailVal != null || firstPasswdVal != null || verifPasswdVal != null) {
            if (firstPasswdVal.localeCompare(verifPasswdVal)) {
                alert("Les mots de passe ne sont pas identiques.");
            } else {
                const header: Object = {
                    headers: new HttpHeaders({
                        Accept: 'application/json',
                        'Content-Type':  'application/json'
                    })
                };
                const user = '{ "Name": "' + emailVal + '", "Username": "' + usernameVal + '", "Password": "' + firstPasswdVal + '" }';
                var juser = JSON.parse(user);
                console.log('juser :>> ', juser);
                this.http.post<RegResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/create", juser, header)
                    .subscribe(regResponse => {
                        this.auth.logIn(regResponse.Id, regResponse.Token);
                        this.dialogRef.close();
                    },
                    error => { 
                        alert("Une erreur est survenue");
                    }
                );

                /*                
                Parse.User.signUp(usernameVal, firstPasswdVal, null)
                .then(res => {
                    this.dialogRef.close()
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
                        case 201:
                            msg = 'Password is required.';
                            break;
                        case 208:
                            msg = 'Account already exists.';
                            break;
                        default:
                            //msg = 'Something goes wrong.';
                            msg = err;
                    }
                    alert(msg);
                });
                */
            }
        }
    }
}