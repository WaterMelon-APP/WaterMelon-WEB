import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as Parse from 'parse';
import {MatDialogRef} from '@angular/material';

import { User } from '@models/user';

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

    constructor(private dialogRef: MatDialogRef<RegisterFormComponent>) { }

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
                alert("Passwords doesn't match");
            } else {
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
            }
        }
    }
}
