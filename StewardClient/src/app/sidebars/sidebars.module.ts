import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

export const sidebarRoutes = [
  {
    path: 'profile',
    component: ProfileComponent,
    outlet: 'sidebar',
  },
];

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(sidebarRoutes),
  ],
  exports: [RouterModule],
})
export class SidebarsModule {}
