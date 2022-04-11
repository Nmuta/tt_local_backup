import { NgModule } from '@angular/core';
import { AllUgcFindService } from './all/ugc/find.service';
import { ApiV2Service } from './api-v2.service';

/** A module for all v2 APIs */
@NgModule({
  providers: [ApiV2Service, AllUgcFindService],
})
export class ApiV2Module {}
