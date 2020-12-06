import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-event-member',
  templateUrl: './card-event-member.component.html',
  styleUrls: ['./card-event-member.component.css']
})
export class CardEventMemberComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() date: string;
  @Input() time: string;
  @Input() place: string;
  @Input() listItems: string;
}
