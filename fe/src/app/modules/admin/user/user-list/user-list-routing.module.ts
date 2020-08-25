import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserListComponent} from './user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    data: {
      breadcrumb: 'Quản Lý Người Dùng',
      icon: 'icofont-justify-all bg-c-green',
      breadcrumb_caption: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit - About Us',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserListRoutingModule { }
