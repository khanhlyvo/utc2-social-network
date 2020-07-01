import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { IInout } from '../models/inout.model';

@Injectable()
export class InoutService {
  baseUrl = Constants.CONTEXT_PATH + 'in-out';

  constructor(private apiService: ApiService) {
  }

  getInouts(pagination): Observable<any> {
    return this.apiService.get(this.baseUrl, pagination);
  }

  addInout(inout: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, inout);
  }

  updateInout(inout: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, inout);
  }

  deleteInout(Inouts: any): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, Inouts);
  }

  getInoutById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.get(this.baseUrl + '/download');
  }
}
