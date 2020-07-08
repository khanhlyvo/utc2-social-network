import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentListRoutingModule } from './department-list-routing.module';
import { DepartmentListComponent } from './department-list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DepartmentListRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [DepartmentListComponent]
})
export class DepartmentListModule { }
