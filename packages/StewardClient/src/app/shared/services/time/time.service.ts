import { Injectable } from '@angular/core';
import { TimeConfig } from '@shared/state/user-settings/user-settings.state';

/**
 *Manages time across the app.
 */
@Injectable({
  providedIn: 'root'
})


export class TimeService {

  localTimeConfig: TimeConfig = {zone: '', offset: ''}
  constructor() { }


  /**
   *convert local time to UTC time 
   */
  public getLocalTimeConfig(): TimeConfig{
    return {zone: '', offset: ''};
  }

  /**
   *f
   */
  public setLocalTimeConfig(timeConfig: TimeConfig): void{
    this.localTimeConfig = timeConfig;
  }


}
