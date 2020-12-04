import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss']
})
export class GravityComponent implements OnInit {
  @Input() public gamertag: string;

  constructor() { }

  ngOnInit(): void {
  }

}
