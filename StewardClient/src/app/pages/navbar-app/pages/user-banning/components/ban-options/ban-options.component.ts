import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ban-options',
  templateUrl: './ban-options.component.html',
  styleUrls: ['./ban-options.component.scss']
})
export class BanOptionsComponent implements OnInit {

  public banDuration: moment.Duration = moment.duration(700, 'days');

  constructor() { }

  ngOnInit(): void {
  }

}
