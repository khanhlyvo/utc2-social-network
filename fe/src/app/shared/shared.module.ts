import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './component/accordion';
import {ToggleFullScreenDirective} from './component/fullscreen/toggle-fullscreen.directive';
import {CardRefreshDirective} from './component/card/card-refresh.directive';
import {CardToggleDirective} from './component/card/card-toggle.directive';
import {SpinnerComponent} from './component/spinner/spinner.component';
import {CardComponent} from './component/card/card.component';
import {ModalAnimationComponent} from './component/modal-animation/modal-animation.component';
import {ModalBasicComponent} from './component/modal-basic/modal-basic.component';
import {DataFilterPipe} from './component/element/data-filter.pipe';
import {MenuItems} from './component/menu-items/menu-items';
import {ParentRemoveDirective} from './component/element/parent-remove.directive';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ClickOutsideModule} from 'ng-click-outside';
import { LoadingComponent } from './component/loading/loading.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {CalendarModule} from 'primeng/calendar';

import {} from './component/chat-box/chat-box.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    NgbModule
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullScreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    SpinnerComponent,
    CardComponent,
    ModalAnimationComponent,
    ModalBasicComponent,
    DataFilterPipe,
    ParentRemoveDirective,
    LoadingComponent,
    ChatBoxComponent,
    PaginationComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullScreenDirective,
    CardRefreshDirective,
    CardToggleDirective,
    SpinnerComponent,
    CardComponent,
    ModalAnimationComponent,
    ModalBasicComponent,
    DataFilterPipe,
    ParentRemoveDirective,
    NgbModule,
    PerfectScrollbarModule,
    ClickOutsideModule,

    ChatBoxComponent,
    PaginationComponent,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,

  ],
  providers: [
    MenuItems,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }
