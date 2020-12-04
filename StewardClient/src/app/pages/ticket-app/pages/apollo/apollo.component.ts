import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-app-apollo',
  templateUrl: './apollo.component.html',
  styleUrls: ['./apollo.component.scss']
})
export class ApolloComponent implements OnInit {
  @Input() public gamertag: string;

  constructor() { }

  ngOnInit(): void {
  }

}
