/**
 * Imagino Imaginis
 * ---------------------------------------------------------------------------
 * Binds all of the different user components, modules, and services together.
 * This is so that Angular framework knows how to put everything together properly.
 */
//Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // This module allows for the routing between pages
import { HttpModule } from '@angular/http'; // This module allows us to make HTTP calls
import { FormsModule } from '@angular/forms'; // This module allows us to have two-way data binding in forms
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

//References to all the components in the application
import { AppComponent } from './app.component';
import { NotFoundComponent } from './notFound.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { SearchComponent } from './search.component';

// References to custom directives
import { FocusDirective } from './directives/focus.directive';

// References to the services used in the app module
import { DBService } from './services/db.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { GeneralService } from './services/general.service';
import { LibraryService } from './services/library.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SearchComponent,
    FocusDirective
  ],
  imports: [
    UserModule,
    AdminModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    DBService,
    UserService,
    AuthService,
    AuthGuard,
    GeneralService,
    LibraryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
