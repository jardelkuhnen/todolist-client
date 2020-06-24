import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { LoginNewComponent } from './login/login-new/login-new.component';
import { LoginRecuperaPasswordComponent } from './login/login-recupera-password/login-recupera-password.component';
import { AuthGuard } from './shared/auth.guard';
import { Role } from './model/role';




const routes: Routes = [
  { path: '', component: OrderListComponent, canActivate: [AuthGuard], data: { roles: [Role.User, Role.Admin]} }, 
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: LoginNewComponent },
  { path: 'reset', component: LoginRecuperaPasswordComponent },
  { path: 'order', component: OrderListComponent, canActivate: [AuthGuard], data: { roles: [Role.User, Role.Admin] } },
  { path: 'order/:id', component: OrderFormComponent, canActivate: [AuthGuard], data: { roles: [Role.User, Role.Admin] } },

  { path:'**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
