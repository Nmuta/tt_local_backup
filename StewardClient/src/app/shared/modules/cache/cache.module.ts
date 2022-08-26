import { NgModule } from '@angular/core';
import { WoodstockCarsCacheService } from './managers/woodstock/cars-cache.service';
import { CommonModule } from '@angular/common';
import { CachedCarComponent } from './components/cached-car/cached-car.component';

/** Module containing various cache-based lookup components. */
@NgModule({
  declarations: [
    CachedCarComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    WoodstockCarsCacheService,
  ]
})
export class CacheModule { }
