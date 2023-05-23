import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { ProcessedAcLog } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, takeUntil } from 'rxjs';

export interface AcLogReaderServiceContract {
  gameTitle: GameTitle;
  processGameLog$(log: ArrayBuffer): Observable<ProcessedAcLog>;
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

  public readonly decodeAcLogsAttribute = PermAttributeName.DecodeAcLogs;

  public formControls = {
    fileName: new FormControl(null, [Validators.required]),
  };

  public fileContent: ArrayBuffer;

  //public fileContent: string;
  public formGroup = new FormGroup(this.formControls);

  constructor() {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<AcLogReaderBaseComponent>): void {
    if (!this.service) {
      throw new Error('Service Contract could not be found for AC Log Reader component.');
    }

    // if (!!changes.service) {
    //   this.service.processGameLog$()
    //   .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
    //   .subscribe(response => {
    //     this.decodedLog = response.result;
    //   });
    // }
  }

  public onFileSelected(event) {
    const file:File = event.target.files[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        this.fileContent = fileReader.result as ArrayBuffer;
        console.log(this.fileContent)
      };

      fileReader.readAsBinaryString(file);
    }
  }

  public onDecodeClick(){
    this.getMonitor = this.getMonitor.repeat();
    console.log(this.fileContent)
    this.service.processGameLog$(this.fileContent)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.decodedLog = response.result;
      })
  }
}
