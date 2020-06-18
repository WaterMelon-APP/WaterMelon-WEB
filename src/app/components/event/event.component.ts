import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service'

export interface EventResponse {
  Id: string;
  Name: string;
  Owner: string;
  Date: Date;
  Address: string;
  Guests: Array<string>;
  Public: boolean;
  ItemList: Array<string>;
}

export interface Bring {
  Name: string;
  Quantity: number;
}

export interface ItemResponse {
  Id: string;
  Name: string;
  Quantity: number;
  Price: number;
  About: string;
  Bring: Array<Bring>;
  Paye: Array<Bring>;
  FromEvent: string;
  QuantityLeft: number;
}

export interface UserResponse {
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
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private auth: AuthService) { }

  needsprice = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsquant = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  pseudoInvit = new FormControl('', [Validators.required, Validators.requiredTrue]);
  payeQuantity = new FormControl('', [Validators.required, Validators.requiredTrue]);
  giveQuantity = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventId;
  itemList;
  event;
  nameEvent;
  needsEvent;
  queryEvent;
  queryNeeds;
  queryItem;
  priceNeeds;
  namesNeeds;
  quantNeeds;
  totalCost;
  payed;
  gived;
  isPrivate;
  memberList;
  adminList;
  membres;
  admins;
  selectedMember;
  selectedAdmin;
  isOwner;
  isAdmin;
  header: Object;
  token: string;
  id: string;

  ngOnInit() {
    this.token = this.auth.getToken();
    this.id = this.auth.getId();
    this.header = {
      headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.token,
      })
    };
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.payed = new Array<Array<Bring>>();
    this.gived = new Array<Array<Bring>>();
    this.isOwner = false;
    this.isAdmin = false;
    this.findEvent().then(() => {this.privateBand();})
    console.log('this.itemList :', this.itemList);
  }

  async findEvent() {
    this.http.get<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, this.header)
    .subscribe(eventResponse => {
        this.event = eventResponse;
        this.needsEvent = eventResponse.ItemList;
        this.nameEvent = eventResponse.Name;
        this.isPrivate = eventResponse.Public;
        this.memberList = eventResponse.Guests;
        //this.adminList = eventResponse.Guests;
        if (!this.needsEvent) {
          this.needsEvent = [];
        }
        if (!this.memberList) {
          this.memberList = [];
        }
        /*if (!this.adminList) {
          this.adminList = [];
        }*/

        this.membres = [];
        //this.admins = [];
        for (let me of this.memberList) {
          this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + me, this.header)
          .subscribe(userResponse => {
                this.membres.push(userResponse.Name);
              },
              error => { 
                alert("Une erreur est survenue");
            }
          );
        }
        /*for (let me of this.adminList) {
          this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + me, this.header)
          .subscribe(userResponse => {
                this.admins.push(userResponse.Name);
              },
              error => { 
                alert("Une erreur est survenue");
            }
          );
        }*/

        for (let item of this.needsEvent) {
          this.http.get<ItemResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/items/" + item, this.header)
          .subscribe(userResponse => {
              this.itemList.push(userResponse);
              this.payed[userResponse.Id] = userResponse.Paye;
              this.gived[userResponse.Id] = userResponse.Bring;
              /*if (userResponse.get("Pay") != null && userResponse.get("Pay")[0] != "") {
                this.payed[userResponse.Id] = true;
              }
              this.gived[userResponse.Id] = false;
              if (userResponse.get("Give") != null && userResponse.get("Give")[0] != "") {
                this.gived[userResponse.Id] = true;
              }*/
  
            },
              error => { 
                alert("Une erreur est survenue");
            }
          );
        }
      },
      error => { 
          alert("Une erreur est survenue");
      }
    );
    /*const eventList = Parse.Object.extend('Event');
    const query = new Parse.Query(eventList);
    query.equalTo('objectId', this.eventId);
    let events = await query.find();
    let item = events[0];
    if (item) {
      this.event = item;
      this.nameEvent = this.event.get('eventName');
      this.needsEvent = this.event.get('itemList');
      this.memberList = this.event.get('usersGuest');
      this.adminList = this.event.get('usersAdmin');
      if (!this.needsEvent) {
        this.needsEvent = [];
      }
      if (!this.memberList) {
        this.memberList = [];
      }
      if (!this.adminList) {
        this.adminList = [];
      }

      const user = Parse.User.current();
      if (user.id == this.event.get("Owner").id) {
        this.isOwner = true;
        this.isAdmin = true;
      }
      else if (this.adminList.includes(user.id)) {
        this.isAdmin = true;
      }

      this.membres = [];
      this.admins = [];
      const users = Parse.Object.extend('User');
      const queryU = new Parse.Query(users);
      for (let me of this.memberList) {
        queryU.equalTo('objectId', me);
        var userList = await queryU.find();
        this.membres.push(userList[0].get("username"));
      }
      for (let me of this.adminList) {
        queryU.equalTo('objectId', me);
        var userList = await queryU.find();
        this.admins.push(userList[0].get("username"));
      }

      let queryNeeds = new Parse.Query('Needs');
      for (let item of this.needsEvent) {
        await queryNeeds.get(item)
        .then(res => {
          this.itemList.push(res);
          this.payed[res.id] = false;
          if (res.get("Pay") != null && res.get("Pay")[0] != "") {
            this.payed[res.id] = true;
          }
          this.gived[res.id] = false;
          if (res.get("Give") != null && res.get("Give")[0] != "") {
            this.gived[res.id] = true;
          }
        }, err => {
          alert(err);
        })
      }
    }*/
  }

  async editEvent() {
    this.router.navigate(['/event-edit', this.eventId])
  }

  async delEvent() {
    this.http.delete("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, this.header)
    .subscribe(userResponse => {
          alert("L'événement " + this.nameEvent + " a bien été supprimé.");
          this.router.navigate(['/list-user']);
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*let item = this.event;
    item.destroy().then((item) => {
      alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
      this.router.navigate(['/list-user']);
    }, (error) => {
      alert(error);
    });*/
  }

  isPersonIn(id) {
    for (let user of this.memberList) {
      if (user == id) {
        return true;
      }
    }
    for (let user of this.adminList) {
      if (user == id) {
        return true;
      }
    }
    return false;
  }

  async addPerson() {
    const pseudoInvitVal = this.pseudoInvit.value as string;

    if (pseudoInvitVal) {
      this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + pseudoInvitVal, this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.memberList.push(userResponse.Id);
            const memberList = '{ "Guests": "' + this.memberList + '" }';
            var jmemberList = JSON.parse(memberList);

            this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jmemberList, this.header)
            .subscribe(userResponse => {
                  alert('Membre ajouté');
                },
                error => { 
                  alert("Une erreur est survenue");
              }
            );
        }}
      },
        error => { 
          alert("Cet utilisateur n'existe pas");
        }
      );
            /*this.event.set('usersGuest', this.memberList);
            this.event.save()
            .then(res => {
              alert('Membre ajouté');
            }, err=> {
              alert(err);
            })
          }
          else {
            alert("Cet utilisateur est déjà membre ou admin de l'event");
          }
        }},*/
      }
  }

  lessMember(member, id) {
    let a = 0;
    for (let i of this.membres) {
      if (i == member) {
        this.membres.splice(a, 1);
        break;
      }
      ++a;
    }
    a = 0;
    for (let i of this.memberList) {
      if (i == id) {
        this.memberList.splice(a, 1);
        break;
      }
      ++a;
    }
  }

  async upMember() {
    if (this.selectedMember) {
      this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.selectedMember, this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.admins.push(this.selectedMember);
            this.adminList.push(userResponse.Id);
            this.lessMember(this.selectedMember, userResponse.Id);

            const adminList = '{ "Guests": "' + this.memberList + '", "Admins": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jadminList, this.header)
            .subscribe(userResponse => {
                  alert('Membre passé admin !');
                },
                error => { 
                  alert("Une erreur est survenue");
              }
            );
        }}
      },
        error => { 
          alert("Cet utilisateur n'existe pas");
        }
      );

      /*const users = Parse.Object.extend('User');
      const query = new Parse.Query(users);
      query.equalTo('username', this.selectedMember);
      var user = await query.find();

      this.admins.push(this.selectedMember);
      this.adminList.push(user[0].id);
      this.lessMember(this.selectedMember, user[0].id);
      this.event.set('usersGuest', this.memberList);
      this.event.save()
      .then(res => {
        console.log('Membre retiré');
      }, err=> {
        alert(err);
      })
      this.event.set('usersAdmin', this.adminList);
      this.event.save()
      .then(res => {
        alert("Membre passé admin !");
      }, err=> {
        alert(err);
      })*/
    }
  }

  async delMember() {
    if (this.selectedMember) {
      this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.selectedMember, this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.lessMember(this.selectedMember, userResponse.Id);

            const memberList = '{ "Guests": "' + this.memberList + '" }';
            var jmemberList = JSON.parse(memberList);

            this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jmemberList, this.header)
            .subscribe(userResponse => {
                  alert("Membre supprimé de l'event");
                },
                error => { 
                  alert("Une erreur est survenue");
              }
            );
        }}
      },
        error => { 
          alert("Cet utilisateur n'existe pas");
        }
      );

      /*const users = Parse.Object.extend('User');
      const query = new Parse.Query(users);
      query.equalTo('username', this.selectedMember);
      var user = await query.find();

      this.lessMember(this.selectedMember, user[0].id);
      this.event.set('usersGuest', this.memberList);
      this.event.save()
      .then(res => {
        alert("Membre supprimé de l'event");
      }, err=> {
        alert(err);
      })*/
    }
  }

  lessAdmin(admin, id) {
    let a = 0;
    for (let i of this.admins) {
      if (i == admin) {
        this.admins.splice(a, 1);
        break;
      }
      a = a + 1;
    }
    a = 0;
    for (let i of this.adminList) {
      if (i == id) {
        this.adminList.splice(a, 1);
        break;
      }
      a = a + 1;
    }
  }

  async downAdmin() {
    if (this.selectedAdmin) {
      this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.selectedMember, this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.membres.push(this.selectedAdmin);
            this.memberList.push(userResponse.Id);
            this.lessAdmin(this.selectedAdmin, userResponse.Id);
      
            const adminList = '{ "Guests": "' + this.memberList + '", "Admins": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jadminList, this.header)
            .subscribe(userResponse => {
                  alert("Admin rétrogradé !");
                },
                error => { 
                  alert("Une erreur est survenue");
              }
            );
        }}
      },
        error => { 
          alert("Cet utilisateur n'existe pas");
        }
      );

      /*const users = Parse.Object.extend('User');
      const query = new Parse.Query(users);
      query.equalTo('username', this.selectedAdmin);
      var user = await query.find();

      this.membres.push(this.selectedAdmin);
      this.memberList.push(user[0].id);
      this.lessAdmin(this.selectedAdmin, user[0].id);
      this.event.set('usersGuest', this.memberList);
      this.event.save()
      .then(res => {
        console.log('Admin retiré');
      }, err=> {
        alert(err);
      })
      this.event.set('usersAdmin', this.adminList);
      this.event.save()
      .then(res => {
        alert("Admin rétrogradé !");
      }, err=> {
        alert(err);
      })*/
    }
  }

  async delAdmin() {
    if (this.selectedAdmin) {
      this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + this.selectedMember, this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.lessAdmin(this.selectedMember, userResponse.Id);

            const adminList = '{ "Admin": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<EventResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/events/" + this.eventId, jadminList, this.header)
            .subscribe(userResponse => {
                  alert("Admin supprimé de l'event");
                },
                error => { 
                  alert("Une erreur est survenue");
              }
            );
        }}
      },
        error => { 
          alert("Cet utilisateur n'existe pas");
        }
      );

      /*const users = Parse.Object.extend('User');
      const query = new Parse.Query(users);
      query.equalTo('username', this.selectedAdmin);
      var user = await query.find();

      this.lessAdmin(this.selectedAdmin, user[0].id);
      this.event.set('usersAdmin', this.adminList);
      this.event.save()
      .then(res => {
        alert("Admin supprimé de l'event");
      }, err=> {
        alert(err);
      })*/
    }
  }

  async createNeeds() {
    const needsnameVal = this.needsname.value as string;
    const needspriceVal = parseFloat(this.needsprice.value as string);
    const needsquantVal = parseInt(this.needsquant.value as string);

    if (needsnameVal != null && needspriceVal != null && needsquantVal != null) {
      const needs = '{ "Name": "' + needsnameVal + '", "Quantity": ' + needsquantVal + ', "Price": ' + needspriceVal + ', "About": "' + "" + '", "FromEvent": "' + this.eventId + '", "QuantityLeft": ' + needsquantVal + ' }';
      var jneeds = JSON.parse(needs);

      this.http.post<ItemResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/items", jneeds, this.header)
      .subscribe(itemResponse => {
            this.needsEvent.push(itemResponse.Id);
            alert('Votre objet a été ajouté avec succès!');
            location.reload();
          },
          error => { 
            alert("Une erreur est survenue");
        }
      );

      /*var needs = Parse.Object.extend('Needs');
      var newNeed = new needs();

      newNeed.set('Name', needsnameVal);
      newNeed.set('Price', needspriceVal);
      newNeed.set('Quantity', needsquantVal);

      newNeed.save()
      .then(res => {
        this.needsEvent.push(newNeed.id);
        this.event.set('itemList', this.needsEvent);
        this.event.save()
        .then(res => {
          console.log('Maj item list');
        }, err=> {
          alert(err);
        })

        alert('Votre objet a été ajouté avec succès!');
        location.reload();
      }, err => {
        alert(err);
      })*/
    }
  }

  async delItem(item){
    let a = 0;
    for (let i of this.needsEvent) {
      if (i == item.Id) {
        this.needsEvent.splice(a, 1);
        break;
      }
      ++a;
    }

    this.http.delete("https://watermelon-api20200526035653.azurewebsites.net/api/items/" + item.Id, this.header)
    .subscribe(userResponse => {
          alert("L'item a bien été supprimé.");
          location.reload();
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*this.event.set('itemList', this.needsEvent);
    this.event.save()
    .then(res => {
      console.log('Maj item list');
    }, err=> {
      alert(err);
    });

    item.destroy().then((item) => {
      alert("L'item a bien été supprimé.");
      location.reload();
    }, (error) => {
      alert(error);
    });*/
  }

  async bringItem(item) {
    //const user = Parse.User.current();
    let payTab = item.Paye;
    if (!payTab) {
      payTab = new Array();
    }
    let giveTab = item.Bring;
    if (!giveTab) {
      giveTab = new Array();
    }

    if (this.payed[item.id] == true) {
      var reponse = window.confirm("Votre choix?");
      if (reponse) {
        payTab[0] = this.id;
        let price = item.Quantity * item.Price
        alert("Paiement de " + item.Quantity + " " + item.Name + " d'une valeur de " + price.toString() + "€.")
      }
      else {
        this.payed[item.Id] = false;
        if (payTab[0]) {
          alert("Remboursement")
        }
        else {
          alert("Paiement annulé");
        }
        payTab[0] = "";
      }
    }
    else {
      if (payTab[0]) {
        let price = item.Quantity * item.Price
        alert("Remboursement de " + item.Quantity + " " + item.Name + " d'une valeur de " + price.toString() + "€.")
      }
    payTab[0] = "";
    }
    if (this.gived[item.Id] == true) {
      giveTab[0] = this.id;
    }
    else {
      giveTab[0] = "";
    }
    const needs = '{ "Id": "' + item.Id + '", "Name": "' + item.Name + '", "Quantity": ' + item.Quantity + ', "Price": ' + item.Price + ', "About": "' + item.About + '", "Bring": ' + this.dispBrings(this.gived[item.Id]) + ', "Paye": ' + this.dispBrings(this.payed[item.Id]) + ', "FromEvent": ' + this.eventId + '", "QuantityLeft": ' + 0 + ' }';
    var jneeds = JSON.parse(needs);

    this.http.put<ItemResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/items", jneeds, this.header)
    .subscribe(itemResponse => {
          console.log('Maj item list');
        },
        error => { 
          alert("Une erreur est survenue");
      }
    );

    /*item.set("Pay", payTab);
    item.set("Give", giveTab);
    item.save()
    .then(res => {
      console.log('Maj item list');
    }, err=> {
      alert(err);
    });*/
  }

  dispBrings(bring) {
    let ret: string = "{";
    let a = 0;
    if (bring) {
      for (let b of bring) {
        if (a) {
          ret = ret + ", ";
        }
        ret = ret + '"' + b.Name + '": ' + b.Quantity;
        a = 1;
      }
    }
    ret = ret + "}";
  }

  async privateBand()
  {
    const band = document.getElementById("grayBandPrivacy");
    if(this.isPrivate == true)
    {
      band.style.visibility="visible";
      console.log("visible");
    }
    if(this.isPrivate == false)
    {
      band.style.visibility="hidden";
      console.log("hidden");
    }
  }

}