/**
 * This TypeScript file handles the routing between components within the web application.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings.component';
import { UploadComponent } from './upload.component';
import { SelectStyleComponent } from './select-style.component';
import { LibraryComponent } from './library.component';

// Import the route guard to prevent users not logged in from going places they aren't allowed ti
import { AuthGuard } from '../services/auth-guard.service';

//The different routes correspond to different components to load based on the route selected
const userRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: UserComponent },
      { path: 'user-settings', component: UserSettingsComponent },
      { path: 'upload', component: UploadComponent }, // user needs to log in before navigating to this page
      { path: 'library', component: LibraryComponent },
      { path: 'select-style', component: SelectStyleComponent },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ],
  providers: []
})

export class UserRoutingModule {}