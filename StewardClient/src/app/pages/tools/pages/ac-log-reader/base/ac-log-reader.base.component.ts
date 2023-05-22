import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { ProcessedAcLog } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

export interface AcLogReaderServiceContract {
  gameTitle: GameTitle;
  processGameLog$(): Observable<ProcessedAcLog>;
}

/** Component for displayingAC Log Reader. */
@Component({
  selector: 'ac-log-reader',
  templateUrl: './ac-log-reader.base.component.html',
  styleUrls: ['./ac-log-reader.base.component.scss'],
})
export class AcLogReaderBaseComponent extends BaseComponent implements OnChanges {
  /** The AC Log Reader service. */
  @Input() service: AcLogReaderServiceContract;
  public getMonitor = new ActionMonitor('Process Log File');
  public decodedLog: string;

  constructor() {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(changes: BetterSimpleChanges<AcLogReaderBaseComponent>): void {
    if (!this.service) {
      throw new Error('Service Contract could not be found for AC Log Reader component.');
    }

    if (!!changes.service) {
      this.service.processGameLog$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.decodedLog = response.result;
      });
    }
  }
}
