import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-event-admin',
  templateUrl: './card-event-admin.component.html',
  styleUrls: ['./card-event-admin.component.css']
})
export class CardEventAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() date: string;
  @Input() time: string;
  @Input() place: string;

}
