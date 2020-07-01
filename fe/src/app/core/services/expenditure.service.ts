import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { IExpenditure } from '../models/expenditure.model';

@Injectable()
export class ExpenditureService {
  baseUrl = Constants.CONTEXT_PATH + 'expenditure';

  constructor(private apiService: ApiService) {
  }

  getExpenditures(pagination): Observable<any> {
    return this.apiService.get(this.baseUrl, pagination);
  }

  addExpenditure(expenditure: IExpenditure): Observable<boolean> {
    return this.apiService.post(this.baseUrl, expenditure);
  }

  updateExpenditure(expenditure: IExpenditure): Observable<boolean> {
    return this.apiService.put(this.baseUrl, expenditure);
  }

  deleteExpenditure(expenditures: IExpenditure[]): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, expenditures);
  }

  getExpenditureById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.post(this.baseUrl + '/download', {});
  }
}
