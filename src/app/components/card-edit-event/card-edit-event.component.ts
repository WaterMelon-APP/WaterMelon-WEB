import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-edit-event',
  templateUrl: './card-edit-event.component.html',
  styleUrls: ['./card-edit-event.component.css']
})
export class CardEditEventComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() date: string;
  @Input() time: string;
  @Input() place: string;
}
