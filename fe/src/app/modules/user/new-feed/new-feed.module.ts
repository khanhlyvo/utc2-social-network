import { NewFeedComponent } from './new-feed.component';
import { NewFeedRoutingModule } from './new-feed-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NewFeedRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  declarations: [
    NewFeedComponent]
})
export class NewFeedModule { }
