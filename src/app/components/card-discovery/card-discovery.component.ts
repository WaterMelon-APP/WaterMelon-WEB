import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-discovery',
  templateUrl: './card-discovery.component.html',
  styleUrls: ['./card-discovery.component.css']
})
export class CardDiscoveryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() date: string;
  @Input() time: string;
  @Input() place: string;

}
