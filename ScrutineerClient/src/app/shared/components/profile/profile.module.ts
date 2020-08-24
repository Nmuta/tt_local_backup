import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProfileComponent } from './profile.cmpt';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule
    ],
    exports: [ProfileComponent]
})
export class ProfileModule {}
