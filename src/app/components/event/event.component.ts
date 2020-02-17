import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  needsprice = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsquant = new FormControl('', [Validators.required, Validators.requiredTrue]);
  needsname = new FormControl('', [Validators.required, Validators.requiredTrue]);
  pseudoInvit = new FormControl('', [Validators.required, Validators.requiredTrue]);
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

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.eventId = id;
    this.itemList = [];
    this.payed = new Array();
    this.gived = new Array();
    this.isOwner = false;
    this.isAdmin = false;
    this.findEvent().then(() => {this.privateBand();})
    console.log('this.itemList :', this.itemList);
  }

  async findEvent() {
    const eventList = Parse.Object.extend('Event');
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
    }
  }

  async editEvent() {
    this.router.navigate(['/event-edit', this.eventId])
  }

  async delEvent() {
    let item = this.event;
    item.destroy().then((item) => {
      alert("L'événement " + item.get('eventName') + " a bien été supprimé.");
      this.router.navigate(['/list-user']);
    }, (error) => {
      alert(error);
    });
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
      const users = Parse.Object.extend('User');
      const query = new Parse.Query(users);
      query.equalTo('username', pseudoInvitVal);
      var user = await query.find();
      if (user[0]) {
        if (!this.isPersonIn(user[0].id)) {
          this.memberList.push(user[0].id);
          this.event.set('usersGuest', this.memberList);
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
      }
      else {
        alert("Cet utilisateur n'existe pas");
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
      const users = Parse.Object.extend('User');
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
      })
    }
  }

  async delMember() {
    if (this.selectedMember) {
      const users = Parse.Object.extend('User');
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
      })
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
      const users = Parse.Object.extend('User');
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
      })
    }
  }

  async delAdmin() {
    if (this.selectedAdmin) {
      const users = Parse.Object.extend('User');
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
      })
    }
  }

  async createNeeds() {
    const needsnameVal = this.needsname.value as string;
    const needspriceVal = parseFloat(this.needsprice.value as string);
    const needsquantVal = parseInt(this.needsquant.value as string);

    if (needsnameVal != null && needspriceVal != null && needsquantVal != null) {
      var needs = Parse.Object.extend('Needs');
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
      })
    }
  }

  async delItem(item){
    let a = 0;
    for (let i of this.needsEvent) {
      if (i == item.id) {
        this.needsEvent.splice(a, 1);
        break;
      }
      ++a;
    }
    this.event.set('itemList', this.needsEvent);
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
    });
  }

  async bringItem(item) {
    const user = Parse.User.current();
    let payTab = item.get("Pay");
    if (!payTab) {
      payTab = new Array();
    }
    let giveTab = item.get("Give");
    if (!giveTab) {
      giveTab = new Array();
    }

    if (this.payed[item.id] == true) {
      payTab[0] = user.id;
    }
    else {
      payTab[0] = "";
    }
    if (this.gived[item.id] == true) {
      giveTab[0] = user.id;
    }
    else {
      giveTab[0] = "";
    }
    item.set("Pay", payTab);
    item.set("Give", giveTab);
    item.save()
    .then(res => {
      console.log('Maj item list');
    }, err=> {
      alert(err);
    });
  }

  async privateBand()
  {
    const isPriv = this.event.get('isPrivate');
    const band = document.getElementById("grayBandPrivacy");
    if(isPriv == true)
    {
      band.style.visibility="visible";
      console.log("visible");
    }
    if(isPriv == false)
    {
      band.style.visibility="hidden";
      console.log("hidden");
    }
  }

}
