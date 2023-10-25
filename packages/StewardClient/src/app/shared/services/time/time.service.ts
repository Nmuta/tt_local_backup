import { Injectable } from '@angular/core';
import { timeConfig } from '@shared/state/user-settings/user-settings.state';

/**
 *Manages time across the app.
 */
@Injectable({
  providedIn: 'root'
})


export class TimeService {

  localTimeConfig: timeConfig = {zone: '', offset: ''}
  constructor() { }


  /**
   *convert local time to UTC time 
   */
  public getLocalTimeConfig(): timeConfig{
    return {zone: '', offset: ''};
  }

  /**
   *f
   */
  public setLocalTimeConfig(timeConfig: timeConfig): void{
    this.localTimeConfig = timeConfig;
  }


}
