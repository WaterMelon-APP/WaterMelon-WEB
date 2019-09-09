import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';

import { User } from '../../Model/User';

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

  constructor(private dialogRef: MatDialogRef<LoginFormComponent>) { }

getErrorMessage() {
  
}

  ngOnInit() {
  }

  async login(user: User) {
    const emailVal = this.email.value as string;
    const passwordVal = this.password.value as string;
    if (emailVal != null || passwordVal != null) {
      Parse.User.logIn(emailVal, passwordVal)
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
        });

    }
  }
}
