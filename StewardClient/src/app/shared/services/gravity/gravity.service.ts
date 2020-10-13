import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GravityPlayerDetails, GravityPlayerInventory } from '@models/gravity';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';

/** Defines the gravity service. */
@Injectable({
  providedIn: 'root',
})
export class GravityService {
  public basePath: string = 'v2/title/gravity';

  constructor(private apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. */
  public getPlayerDetailsByGamertag(
    gamertag: string
  ): Observable<GravityPlayerDetails> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/details/gamertag(${gamertag})`
    );
  }

  /** Gets gravity player details with a XUID. */
  public getPlayerDetailsByXuid(
    xuid: string
  ): Observable<GravityPlayerDetails> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/details/xuid(${xuid})`
    );
  }

  /** Gets gravity player details with a T10 ID. */
  public getPlayerDetailsByT10Id(
    t10Id: string
  ): Observable<GravityPlayerDetails> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/details/t10Id(${t10Id})`
    );
  }

  /** Gets gravity player inventory with a XUID. */
  public getPlayerInventoryByXuid(
    xuid: string
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/inventory/xuid(${xuid})`
    );
  }

  /** Gets gravity player inventory with a T10 ID. */
  public getPlayerInventoryByT10Id(
    t10Id: string
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/inventory/t10Id(${t10Id})`
    );
  }

  /** Gets gravity player inventory with a profile ID. */
  public getPlayerInventoryByProfileIdWithXuid(
    xuid: string,
    profileId: string
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/inventory/xuid(${xuid})/profileId(${profileId})`
    );
  }

  /** Gets gravity player inventory with a profile ID. */
  public getPlayerInventoryByProfileIdWithT10Id(
    t10Id: string,
    profileId: string
  ): Observable<GravityPlayerInventory> {
    return this.apiService.getRequest<any>(
      `${this.basePath}/player/inventory/t10Id(${t10Id})/profileId(${profileId})`
    );
  }

  /** Updates gravity player inventory with a XUID. */
  public updatePlayerInventoryByXuid(
    inventory: GravityPlayerInventory,
    useBackgroundProcessing: boolean = false
  ): Observable<GravityPlayerInventory> {
    // TODO: Check that xuid exists in inventory
    const params = new HttpParams().append(
      'useBackgroundProcessing',
      useBackgroundProcessing.toString()
    );

    return this.apiService.postRequest<any>(
      `${this.basePath}/player/inventory/xuid`,
      inventory,
      params
    );
  }

  /** Updates gravity player inventory with a T10 Id. */
  public updatePlayerInventoryByT10Id(
    inventory: GravityPlayerInventory,
    useBackgroundProcessing: boolean = false
  ): Observable<GravityPlayerInventory> {
    // TODO: Check that t10Id exists in inventory
    const params = new HttpParams().append(
      'useBackgroundProcessing',
      useBackgroundProcessing.toString()
    );

    return this.apiService.postRequest<any>(
      `${this.basePath}/player/inventory/t10Id`,
      inventory,
      params
    );
  }
}
