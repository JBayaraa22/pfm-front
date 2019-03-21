import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BudgetComponent } from './budget/budget.component';
import { CategoryComponent } from './category/category.component';
import { TransactionComponent } from './transaction/transaction.component';

const routes: Routes = [
    {
        path : 'user',
        component: UserComponent,
        canActivate:[AuthGuard],
        children:[
            { path : '' , pathMatch : 'full'  , redirectTo : 'dashboard' },
            { path : 'dashboard' , component : DashboardComponent },
            { path : 'budget' , component : BudgetComponent },
            { path : 'category' , component : CategoryComponent },
            { path : 'transaction' , component : TransactionComponent }

        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
