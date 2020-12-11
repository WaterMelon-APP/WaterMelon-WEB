import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  formItemQ = new FormArray([]);
  formItemP = new FormArray([]);
  eventId;
  itemList: Array<Item>;
  event;
  nameEvent;
  needsEvent: Array<string>;
  isPrivate;
  username: string;
  dateEvent: Date;
  addressEvent: string;
  memberList: Array<string>;
  invitationList: Array<string>;
  membres: Array<string>;
  invites: Array<string>;
  selectedMember;
  isOwner;
  header: Object;
  id: string;
  contributions: Map<string, number>;

  ngOnInit() {
    this.id = this.auth.getId();
    this.username = this.auth.getUsername();
    this.header = this.auth.getSecureHeader();
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.contributions = new Map();
    this.isOwner = false;
    this.findEvent().then(() => { this.privateBand(); })
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
        this.addressEvent = eventResponse.Address;
        if (!this.needsEvent) {
          this.needsEvent = [];
        }
        if (!this.memberList) {
          this.memberList = [];
        }
        if (!this.invitationList) {
          this.invitationList = [];
        }
        if (this.username == this.event.Owner) {
          this.isOwner = true;
        }

        this.invites = [];

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

        for (let item of this.needsEvent) {
          this.http.get<Item>(this.auth.callItems(item), this.header)
            .subscribe(userResponse => {
              this.itemList.push(userResponse);
              this.formItemP[userResponse.Id] = new FormControl('', [Validators.required, Validators.requiredTrue]);
              this.formItemQ[userResponse.Id] = new FormControl('', [Validators.required, Validators.requiredTrue]);
              if (userResponse.Bring && userResponse.Bring[this.id]) {
                this.contributions.set(userResponse.Name, userResponse.Bring[this.id]);
              }
              else {
                this.contributions.set(userResponse.Name, 0);
              }
              if (userResponse.Pay && userResponse.Pay[this.id]) {
                if (this.contributions.has(userResponse.Name)) {
                  this.contributions.set(userResponse.Name, this.contributions.get(userResponse.Name) + (userResponse.Pay[this.id] / userResponse.Price))
                }
                else {
                  this.contributions.set(userResponse.Name, userResponse.Pay[this.id] / userResponse.Price)
                }
              }
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
      console.log('this.contributions :>> ', this.contributions);
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

  async delMember(membre) {

    console.log(membre);
    membre = '{ "guestname": "' + membre + '" }';
    console.log(membre);
    var jevent = JSON.parse(membre);
    console.log('jevent :>> ', jevent);
    this.http.post(this.auth.callDelMember(this.eventId), membre, this.header)
      .subscribe(userResponse => {
        this.openSnackBar("Membre supprimé de l'event", "Fermer");
        location.reload();
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }

async createNeeds() {
  const needsnameVal = this.needsname.value as string;
  const needspriceVal = parseFloat(this.needsprice.value as string);
  const needsquantVal = parseInt(this.needsquant.value as string);

  if (needsnameVal != null && needspriceVal != null && needsquantVal != null) {
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

async delItem(item) {
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
  let itemVal = this.formItemQ[item.Id].value as number;

  if (item.Bring && item.Bring[this.id]) {
    itemVal = itemVal + item.Bring[this.id]
  }

  if (itemVal != null) {
    const sendItem = '{ "userId": "' + this.id + '", "Quantity": ' + Math.round(itemVal) + ' }';
    var jitem = JSON.parse(sendItem);
    this.http.put<Item>(this.auth.callItemGive(item.Id), jitem, this.header)
      .subscribe(itemResponse => {
        this.openSnackBar('Contribution prise en compte !', "Fermer");
        location.reload();
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }
}

async payItem(item) {
  let itemVal = this.formItemP[item.Id].value as number;

  if (item.Pay && item.Pay[this.id]) {
    itemVal = itemVal + item.Pay[this.id]
  }

  if (itemVal != null) {
    const sendItem = '{ "userId": "' + this.id + '", "Amount": ' + Math.round(itemVal) + ' }';
    var jitem = JSON.parse(sendItem);
    this.http.put<Item>(this.auth.callItemPay(item.Id), jitem, this.header)
      .subscribe(itemResponse => {
        this.openSnackBar('Contribution prise en compte !', "Fermer");
        location.reload();
      },
        error => {
          this.openSnackBar("Une erreur est survenue", "Fermer");
        }
      );
  }
}

async privateBand() {
  const band = document.getElementById("grayBandPrivacy");
  if (this.isPrivate == true) {
    band.style.visibility = "visible";
    console.log("visible");
  }
  if (this.isPrivate == false) {
    band.style.visibility = "hidden";
    console.log("hidden");
  }
}

async sendTweet() {
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