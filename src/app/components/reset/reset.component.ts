import { Component, OnInit, Input } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required, Validators.requiredTrue]);

  constructor(private router: Router, private _snackBar: MatSnackBar, private http: HttpClient, private auth: AuthService) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  async send() {
    const emailVal = this.email.value as string;
    const usernameVal = this.username.value as string;
    if (emailVal != null || usernameVal != null) {

      const header: Object = this.auth.getHeader();
      const user = '{ "Username": "' + usernameVal + '", "Email": "' + emailVal + '" }';
      var juser = JSON.parse(user);
      console.log('juser :>> ', juser);
      this.http.post<User>(this.auth.callUsersForgotPass(), juser, header)
      .subscribe(response => {
          this.auth.logIn(response.Id, response.Token, response.Username);
          console.log('reponse :>> ', response);
          this.router.navigate(['/change-pass/', response.Id])
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
  }
}