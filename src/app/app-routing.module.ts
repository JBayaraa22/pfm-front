import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponent } from './components/recover/recover.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path : '',
    component : AppComponent,
    children : [
      { path : '' , pathMatch : 'full' , redirectTo : 'login' },
      { path : 'login' , component : LoginComponent },
      { path : 'recover' , component : RecoverComponent },
      { path : 'signup'  , component : RegisterComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
