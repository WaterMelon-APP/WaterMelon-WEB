import * as Parse from 'parse';
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})

export class ResetComponent implements OnInit {

  email;
  link;
  mail = "mailto:?subject=Reset%20identifier&body=Lien%20:" + this.link;
  constructor() {}

  ngOnInit(){
    this.resetIdentifier();
  }
  async resetIdentifier() {
  }
}
