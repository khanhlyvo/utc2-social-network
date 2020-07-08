import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class DepartmentModule { }
