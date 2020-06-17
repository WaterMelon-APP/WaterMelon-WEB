import { Injectable } from '@angular/core';

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

  logIn(id, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
  }

  logOut() {
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
  }
}
