// -----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileCmpt } from './profile.cmpt';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [ProfileCmpt],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule
    ],
    exports: [ProfileCmpt]
})
export class ProfileModule {}
