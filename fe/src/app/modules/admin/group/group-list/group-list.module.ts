import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupListRoutingModule } from './group-list-routing.module';
import { GroupListComponent } from './group-list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    GroupListRoutingModule,
    SharedModule,
    NgbModule
  ],
  declarations: [GroupListComponent]
})
export class GroupListModule { }
