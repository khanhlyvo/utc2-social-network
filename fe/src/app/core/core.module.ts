import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import {  ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { DeviceService } from './services/device.service';
import { TicketMonthService } from './services/ticket-month.service';
import { ExpenditureService } from './services/expenditure.service';
import { UserService } from './services/user.service';
import { InoutService } from './services/inout.service';
import { CardService } from './services/card.service';
import { ChatBoxService } from './services/chat-box.service';
import { GroupService } from './services/group.service';
import { DepartmentService } from './services/department.service';
import { SocketService } from './services/socket.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    DeviceService,
    TicketMonthService,
    ExpenditureService,
    UserService,
    InoutService,
    CardService,
    ChatBoxService,
    GroupService,
    DepartmentService,
    MessageService,
    ConfirmationService,
    SocketService,
    { provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
