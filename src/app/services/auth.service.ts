import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  address="https://watermelon-api-dev-as.azurewebsites.net/api/"

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

  getUsername() {
    return (localStorage.getItem("username"));
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

  logIn(id, token, username) {
    localStorage.setItem("token", token);
    localStorage.setItem("id", id);
    localStorage.setItem("username", username);
  }

  logOut() {
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("username", "");
  }

  callEvents(id) {
    return (this.address + "events/" + id)
  }

  callEventsSearch() {
    return (this.address + "events/")
  }

  callEventsSearchfromuser(id) {
    return (this.address + "events/searchfromuser/" + id)
  }

  callUsers(id){
    return (this.address + "users/" + id)
  }

  callUsersByName(id){
    return (this.address + "users/ByName/" + id)
  }

  callUsersCreate() {
    return (this.address + "users/create/")
  }

  callUsersLogin() {
    return (this.address + "users/login/")
  }

  callItems(id) {
    return (this.address + "items/" + id)
  }
}