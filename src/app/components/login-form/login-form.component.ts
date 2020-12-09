import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {

  hide = true;

  user = {} as User;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private dialogRef: MatDialogRef<LoginFormComponent>, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

  getErrorMessage() { }

  ngOnInit() { }

  async login(user: User) {
    const emailVal = this.email.value as string;
    const passwordVal = this.password.value as string;
    if (emailVal != null || passwordVal != null) {

      const header: Object = this.auth.getHeader();
      const user = '{ "Username": "' + emailVal + '", "Password": "' + passwordVal + '" }';
      var juser = JSON.parse(user);
      console.log('juser :>> ', juser);
      this.http.post<User>(this.auth.callUsersLogin(), juser, header)
      .subscribe(logResponse => {
          this.auth.logIn(logResponse.Id, logResponse.Token, logResponse.Username);
          this.dialogRef.close();
        },
        error => {
            this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
