import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetComponent } from './budget/budget.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RefreshComponent } from '../components/refresh/refresh.component';
import { TranslateModule } from '@ngx-translate/core';
import {NgSelectizeModule} from 'ng-selectize';
@NgModule({
  declarations: [
    BudgetComponent, 
    TransactionComponent, 
    CategoryComponent, 
    DashboardComponent, 
    UserComponent,
    RefreshComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    TranslateModule ,
    NgSelectizeModule
  ]
})
export class UserModule { }
