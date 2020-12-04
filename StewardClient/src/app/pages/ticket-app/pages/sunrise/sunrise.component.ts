import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-app-sunrise',
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss']
})
export class SunriseComponent implements OnInit {
  @Input() public gamertag: string;

  constructor() { }

  ngOnInit(): void {
  }

}
