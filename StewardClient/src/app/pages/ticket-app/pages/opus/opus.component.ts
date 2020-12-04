import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-app-opus',
  templateUrl: './opus.component.html',
  styleUrls: ['./opus.component.scss']
})
export class OpusComponent implements OnInit {
  @Input() public gamertag: string;

  constructor() { }

  ngOnInit(): void {
  }

}
