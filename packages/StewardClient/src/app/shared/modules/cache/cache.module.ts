import { NgModule } from '@angular/core';
import { WoodstockCarsCacheService } from './managers/woodstock/cars-cache.service';
import { CommonModule } from '@angular/common';
import { CachedCarComponent } from './components/cached-car/cached-car.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';

/** Module containing various cache-based lookup components. */
@NgModule({
  declarations: [CachedCarComponent],
  imports: [CommonModule, MatChipsModule, MatIconModule, MatTooltipModule, StandardCopyModule],
  providers: [WoodstockCarsCacheService],
  exports: [CachedCarComponent],
})
export class CacheModule {}
