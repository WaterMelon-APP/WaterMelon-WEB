import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'
import { Item, Bring } from '../../models/item.model'
import { User } from '../../models/user.model'

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
  payed;
  gived;
  isPrivate;
  memberList: Array<string>;
  adminList: Array<string>;
  invitationList: Array<string>;
  membres: Array<string>;
  admins: Array<string>;
  invites: Array<string>;
  selectedMember;
  selectedAdmin;
  isOwner;
  isAdmin;
  header: Object;
  id: string;

  ngOnInit() {
    this.id = this.auth.getId();
    this.header = this.auth.getSecureHeader();
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
    this.http.get<Event>(this.auth.callEvents(this.eventId), this.header)
    .subscribe(eventResponse => {
        this.event = eventResponse;
        this.needsEvent = eventResponse.ItemList;
        this.nameEvent = eventResponse.Name;
        this.isPrivate = eventResponse.Public;
        this.memberList = eventResponse.Guests;
        this.invitationList = eventResponse.InvitationList;
        //this.adminList = eventResponse.Guests;
        if (!this.needsEvent) {
          this.needsEvent = [];
        }
        if (!this.memberList) {
          this.memberList = [];
        }
        if (!this.invitationList) {
          this.invitationList = [];
        }
        //if (!this.adminList) {
          this.adminList = [];
        //}

        if (this.id == this.event.Owner) {
          this.isOwner = true;
          this.isAdmin = true;
        }

        /*this.membres = [];
        //this.admins = [];
        this.invites = [];
        for (let me of this.memberList) {
          this.http.get<User>(this.auth.callUsers(me), this.header)
          .subscribe(userResponse => {
                this.membres.push(userResponse.Username);
              },
              error => {
                alert("Une erreur est survenue");
            }
          );
        }

        for (let invited of this.invitationList) {
          this.http.get<User>(this.auth.callUsers(invited), this.header)
          .subscribe(userResponse => {
                this.invites.push(userResponse.Username);
              },
              error => {
                alert("Une erreur est survenue");
            }
          );
        }*/

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
          this.http.get<Item>(this.auth.callItems(item), this.header)
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
  }

  async editEvent() {
    this.router.navigate(['/event-edit', this.eventId])
  }

  async delEvent() {
    this.http.delete(this.auth.callEvents(this.eventId), this.header)
    .subscribe(userResponse => {
          alert("L'événement " + this.nameEvent + " a bien été supprimé.");
          this.router.navigate(['/list-user']);
        },
        error => {
          alert("Une erreur est survenue");
      }
    );
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
      this.http.get<User>(this.auth.callUsersByName(pseudoInvitVal), this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.memberList.push(userResponse.Id);
            const memberList = '{ "Guests": "' + this.memberList + '" }';
            var jmemberList = JSON.parse(memberList);

            this.http.put<Event>(this.auth.callEvents(this.eventId), jmemberList, this.header)
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
      this.http.get<User>(this.auth.callUsersByName(this.selectedMember), this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.admins.push(this.selectedMember);
            this.adminList.push(userResponse.Id);
            this.lessMember(this.selectedMember, userResponse.Id);

            const adminList = '{ "Guests": "' + this.memberList + '", "Admins": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<Event>(this.auth.callEvents(this.eventId), jadminList, this.header)
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
    }
  }

  async delMember() {
    if (this.selectedMember) {
      this.http.get<User>(this.auth.callUsersByName(this.selectedMember), this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.lessMember(this.selectedMember, userResponse.Id);

            const memberList = '{ "Guests": "' + this.memberList + '" }';
            var jmemberList = JSON.parse(memberList);

            this.http.put<Event>(this.auth.callEvents(this.eventId), jmemberList, this.header)
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
      this.http.get<User>(this.auth.callUsersByName(this.selectedMember), this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.membres.push(this.selectedAdmin);
            this.memberList.push(userResponse.Id);
            this.lessAdmin(this.selectedAdmin, userResponse.Id);

            const adminList = '{ "Guests": "' + this.memberList + '", "Admins": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<Event>(this.auth.callEvents(this.eventId), jadminList, this.header)
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
    }
  }

  async delAdmin() {
    if (this.selectedAdmin) {
      this.http.get<User>(this.auth.callUsersByName(this.selectedMember), this.header)
      .subscribe(userResponse => {
        if (userResponse) {
          if (!this.isPersonIn(userResponse.Id)) {
            this.lessAdmin(this.selectedMember, userResponse.Id);

            const adminList = '{ "Admin": "' + this.adminList + '" }';
            var jadminList = JSON.parse(adminList);

            this.http.put<Event>(this.auth.callEvents(this.eventId), jadminList, this.header)
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
    }
  }

  async createNeeds() {
    const needsnameVal = this.needsname.value as string;
    const needspriceVal = parseFloat(this.needsprice.value as string);
    const needsquantVal = parseInt(this.needsquant.value as string);

    if (needsnameVal != null && needspriceVal != null && needsquantVal != null) {
      const needs = '{ "Name": "' + needsnameVal + '", "Quantity": ' + needsquantVal + ', "Price": ' + needspriceVal + ', "About": "' + "" + '", "FromEvent": "' + this.eventId + '", "QuantityLeft": ' + needsquantVal + ' }';
      var jneeds = JSON.parse(needs);

      this.http.post<Item>(this.auth.callItems(""), jneeds, this.header)
      .subscribe(itemResponse => {
            this.needsEvent.push(itemResponse.Id);
            alert('Votre objet a été ajouté avec succès!');
            location.reload();
          },
          error => {
            alert("Une erreur est survenue");
        }
      );
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

    this.http.delete(this.auth.callItems(item.Id), this.header)
    .subscribe(userResponse => {
          alert("L'item a bien été supprimé.");
          location.reload();
        },
        error => {
          alert("Une erreur est survenue");
      }
    );
  }

  async bringItem(item) {
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

    this.http.put<Item>(this.auth.callItems(""), jneeds, this.header)
    .subscribe(itemResponse => {
          console.log('Maj item list');
        },
        error => {
          alert("Une erreur est survenue");
      }
    );
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

  async privateBand(){
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
