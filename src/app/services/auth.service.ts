import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "");
    }
    if (!localStorage.getItem("id")) {
      localStorage.setItem("id", "");
    }
  }

  getId() {
    return (localStorage.getItem("id"));
  }

  getToken() {
    return (localStorage.getItem("token"));
  }

  getSecureHeader() {
    let header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.getToken(),
      })
    };
    return (header);
  }

  getHeader() {
    let header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json'
      })
    };
    return (header);
  }

  logIn(id, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
  }

  logOut() {
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
  }
}
