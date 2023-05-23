import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SteelheadAcLogReaderService } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { AcLogReaderServiceContract } from '../base/ac-log-reader.base.component';

/** Component for displaying routed Steelhead AC Log Reader. */
@Component({
  selector: 'steelhead-ac-log-reader',
  templateUrl: './steelhead-ac-log-reader.component.html',
  styleUrls: ['./steelhead-ac-log-reader.component.scss'],
})
export class SteelheadAcLogReaderComponent{
  public title: GameTitle.FM8;
  public serviceContract: AcLogReaderServiceContract;


  constructor(private readonly steelheadService: SteelheadAcLogReaderService) {
    this.serviceContract = {
      gameTitle: GameTitle.FM8,
      processGameLog$: (log) =>
        steelheadService.postAcLogReader$(log),
    };
  }
}
