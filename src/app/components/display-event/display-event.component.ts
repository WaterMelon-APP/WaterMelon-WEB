import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-event',
  templateUrl: './display-event.component.html',
  styleUrls: ['./display-event.component.css']
})
export class DisplayEventComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() isPrivate: string;
  @Input() date: string;
  @Input() time: string;
  @Input() place: string;

}
