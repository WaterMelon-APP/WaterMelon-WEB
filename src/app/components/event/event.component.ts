import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service'
import { Event } from '../../models/event.model'
import { Item, Bring } from '../../models/item.model'
import { User } from '../../models/user.model'
import { Invitation } from '../../models/invitation.model'

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private auth: AuthService, private _snackBar: MatSnackBar) { }

  needsprice = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsquant = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  pseudoInvit = new FormControl('', [Validators.required, Validators.requiredTrue]);
  payeQuantity = new FormControl('', [Validators.required, Validators.requiredTrue]);
  giveQuantity = new FormControl('', [Validators.required, Validators.requiredTrue]);
  eventId;
  itemList: Array<Item>;
  event;
  nameEvent;
  needsEvent: Array<string>;
  payed;
  paye;
  gived;
  give;
  isPrivate;
  username: string;
  dateEvent: Date;
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
    this.username = this.auth.getUsername();
    this.header = this.auth.getSecureHeader();
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.paye = new Array<Array<Bring>>();
    this.give = new Array<Array<Bring>>();
    this.gived = [];
    this.payed = [];
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
        this.dateEvent = eventResponse.Date;
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
        if (this.username == this.event.Owner) {
          this.isOwner = true;
          this.isAdmin = true;
        }

        //this.membres = [];
        //this.admins = [];
        this.invites = [];
        /*for (let me of this.memberList) {
          this.http.get<User>(this.auth.callUsers(me), this.header)
          .subscribe(userResponse => {
                this.membres.push(userResponse.Username);
              },
              error => {
                this.openSnackBar("Une erreur est survenue");
            }
          );
        }*/

        for (let invitation of this.invitationList) {
          this.http.get<Invitation>(this.auth.callInvitations(invitation), this.header)
          .subscribe(userResponse => {
              if (!userResponse.Status) {
                this.invites.push(userResponse.To);
              }
            },
            error => {
              this.openSnackBar("Une erreur est survenue", "Fermer");
            }
          );
        }

        /*for (let me of this.adminList) {
          this.http.get<UserResponse>("https://watermelon-api20200526035653.azurewebsites.net/api/users/" + me, this.header)
          .subscribe(userResponse => {
                this.admins.push(userResponse.Name);
              },
              error => {
                this.openSnackBar("Une erreur est survenue");
            }
          );
        }*/

        for (let item of this.needsEvent) {
          this.http.get<Item>(this.auth.callItems(item), this.header)
          .subscribe(userResponse => {
              this.itemList.push(userResponse);
              console.log('userResponse :>> ', userResponse);
              this.paye[userResponse.Id] = userResponse.Pay;
              this.give[userResponse.Id] = userResponse.Bring;
              console.log('this.payed :>> ', this.payed);
              console.log('this.gived :>> ', this.gived);
              console.log('this.paye :>> ', this.paye);
              console.log('this.give :>> ', this.give);
            if (this.paye[userResponse.Id]) {
                this.payed[userResponse.Id] = true;
              }
              else if (!this.paye[userResponse.Id]) {
                this.payed[userResponse.Id] = false;
              }
              if (this.give[userResponse.Id]) {
                this.gived[userResponse.Id] = true;
              }
              else if (!this.give[userResponse.Id]){
                this.gived[userResponse.Id] = false;
              }
              console.log('this.payed :>> ', this.payed);
              console.log('this.gived :>> ', this.gived);
              console.log('this.paye :>> ', this.paye);
              console.log('this.give :>> ', this.give);
              /*if (userResponse.get("Pay") != null && userResponse.get("Pay")[0] != "") {
                this.payed[userResponse.Id] = true;
              }
              this.gived[userResponse.Id] = false;
              if (userResponse.get("Give") != null && userResponse.get("Give")[0] != "") {
                this.gived[userResponse.Id] = true;
              }*/

            },
              error => {
                this.openSnackBar("Une erreur est survenue", "Fermer");
            }
          );
        }
      },
      error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
      }
    );
  }

  async editEvent() {
    this.router.navigate(['/event-edit', this.eventId])
  }

  async delEvent() {
    this.http.delete(this.auth.callEvents(this.eventId), this.header)
    .subscribe(userResponse => {
          const text = "L'événement " + this.nameEvent + " a bien été supprimé.";
          this.openSnackBar(text, "Fermer");
          this.router.navigate(['/list-user']);
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
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
      if (!this.isPersonIn(pseudoInvitVal)) {
        const invitation = '{ "From": "' + this.username + '", "To": "' + pseudoInvitVal + '", "EventId": "' + this.eventId + '" }';
        var jinvitation = JSON.parse(invitation);
        console.log('jinvitation :>> ', jinvitation);
        this.http.post<Invitation>(this.auth.callInvitations(""), jinvitation, this.header)
        .subscribe(userResponse => {
              this.openSnackBar('Invitation envoyé', "Fermer");
            },
            error => {
              this.openSnackBar("Une erreur est survenue", "Fermer");
          }
        );
      }
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
                  this.openSnackBar('Membre passé admin !', "Fermer");
                },
                error => {
                  this.openSnackBar("Une erreur est survenue", "Fermer");
              }
            );
        }}
      },
        error => {
          this.openSnackBar("Cet utilisateur n'existe pas", "Fermer");
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
                  this.openSnackBar("Membre supprimé de l'event", "Fermer");
                },
                error => {
                  this.openSnackBar("Une erreur est survenue", "Fermer");
              }
            );
        }}
      },
        error => {
          this.openSnackBar("Cet utilisateur n'existe pas", "Fermer");
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
                  this.openSnackBar("Admin rétrogradé !", "Fermer");
                },
                error => {
                  this.openSnackBar("Une erreur est survenue", "Fermer");
              }
            );
        }}
      },
        error => {
          this.openSnackBar("Cet utilisateur n'existe pas", "Fermer");
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
                  this.openSnackBar("Admin supprimé de l'event", "Fermer");
                },
                error => {
                  this.openSnackBar("Une erreur est survenue", "Fermer");
              }
            );
        }}
      },
        error => {
          this.openSnackBar("Cet utilisateur n'existe pas", "Fermer");
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
            this.openSnackBar('Votre objet a été ajouté avec succès!', "Fermer");
            location.reload();
          },
          error => {
            this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
  }

  async delItem(item){
    this.http.delete(this.auth.callItems(item.Id), this.header)
    .subscribe(userResponse => {
          this.openSnackBar("L'item a bien été supprimé.", "Fermer");
          location.reload();
        },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
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
        let price = item.Quantity * item.Price;
        const text="Paiement de " + item.Quantity + " " + item.Name + " d'une valeur de " + price.toString() + "€.";
        this.openSnackBar(text, "Fermer");
      }
      else {
        this.payed[item.Id] = false;
        if (payTab[0]) {
          this.openSnackBar("Remboursement", "Fermer");
        }
        else {
          this.openSnackBar("Paiement annulé", "Fermer");
        }
        payTab[0] = "";
      }
    }
    else {
      if (payTab[0]) {
        let price = item.Quantity * item.Price;
        const text="Remboursement de " + item.Quantity + " " + item.Name + " d'une valeur de " + price.toString() + "€.";
        this.openSnackBar(text, "Fermer");
      }
    payTab[0] = "";
    }
    if (this.gived[item.Id] == true) {
      giveTab[0] = this.id;
    }
    else {
      giveTab[0] = "";
    }
    const needs = '{ "userId": "' + this.id + '", "Quantity": ' + item.Quantity + ' }'
    console.log('needs :>> ', needs);
    var jneeds = JSON.parse(needs);

    if (this.payed[item.Id] == true) {
      console.log('this.auth.callItemPay(item.Id) :>> ', this.auth.callItemPay(item.Id));
      this.http.put<Item>(this.auth.callItemPay(item.Id), jneeds, this.header)
      .subscribe(itemResponse => {
            console.log('Maj item list');
          },
          error => {
            this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
    else if (this.gived[item.Id] == true) {
      this.http.put<Item>(this.auth.callItemGive(item.Id), jneeds, this.header)
      .subscribe(itemResponse => {
            console.log('Maj item list');
          },
          error => {
            this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
    }
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

  async sendTweet()
  {
    const link = "https://watermelonapp.azurewebsites.net/"; //+ //add le lien de l event
    var text = "Hey%2C%20je%20viens%20de%20cr%C3%A9er%20mon%20%C3%A9v%C3%A9nement%20" + this.nameEvent + "%20rejoint%20moi%20!" + link;
    const tweet_url = "http://twitter.com/intent/tweet?text=" + text;
    window.open(tweet_url, "_blank");
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
