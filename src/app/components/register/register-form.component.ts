import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service'

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

    constructor(private dialogRef: MatDialogRef<RegisterFormComponent>, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

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
                this.openSnackBar("Les mots de passe ne sont pas identiques.", "Fermer");
            } else {
                const header: Object = this.auth.getHeader();
                const user = '{ "Email": "' + emailVal + '", "Username": "' + usernameVal + '", "Password": "' + firstPasswdVal + '" }';
                var juser = JSON.parse(user);
                console.log('juser :>> ', juser);
                this.http.post<User>(this.auth.callUsersCreate(), juser, header)
                    .subscribe(regResponse => {
                        this.auth.logIn(regResponse.Id, regResponse.Token, regResponse.Username);
                        this.dialogRef.close();
                    },
                    error => {
                        this.openSnackBar("Une erreur est survenue", "Fermer");
                    }
                );
            }
        }
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 5000,
      });
    }
}
