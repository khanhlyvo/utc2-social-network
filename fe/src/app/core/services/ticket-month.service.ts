import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { ITicketMonth } from '../models/ticketMonth.model';

@Injectable()
export class TicketMonthService {
  baseUrl = Constants.CONTEXT_PATH + 'ticket-month';

  constructor(private apiService: ApiService) {
  }
  getTicketMonths(pagination): Observable<any> {
    return this.apiService.get(this.baseUrl, pagination);
  }

  addTicketMonth(ticketMonth: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, ticketMonth);
  }

  updateDevice(ticketMonth: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, ticketMonth);
  }

  deleteTicketMonth(ticketMonths: ITicketMonth[]): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, ticketMonths);
  }
}
