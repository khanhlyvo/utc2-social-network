import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import { AuthGuard } from './shared/component/auth/auth.guard';
import { Role } from './core/models/role.model';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }, {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard-default/dashboard-default.module').then(m => m.DashboardDefaultModule),

        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
      }, {
        path: 'basic',
        loadChildren: () => import('./pages/ui-elements/basic/basic.module').then(m => m.BasicModule)
      },  {
        path: 'user',
        loadChildren: () => import('./modules/admin/user/user.module').then(m => m.UserModule),
      },{
        path: 'notifications',
        loadChildren: () => import('./pages/ui-elements/advance/notifications/notifications.module').then(m => m.NotificationsModule)
      }, {
        path: 'bootstrap-table',
        loadChildren: () => import('./pages/ui-elements/tables/bootstrap-table/basic-bootstrap/basic-bootstrap.module').then(m => m.BasicBootstrapModule),
      }, {
        path: 'map',
        loadChildren: () => import('./pages/map/google-map/google-map.module').then(m => m.GoogleMapModule),
      }, {
        path: 'profile',
        loadChildren: () => import('./modules/user/profile/profile.module').then(m => m.ProfileModule)
      },
       {
        path: 'simple-page',
        loadChildren: () => import('./pages/simple-page/simple-page.module').then(m => m.SimplePageModule)
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: AuthComponent,
    // children: [
    //   {
    //     path: 'authentication',
    //     loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
