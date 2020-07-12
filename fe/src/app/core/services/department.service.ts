import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Department } from '../models/department.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class DepartmentService {
  baseUrl = Constants.CONTEXT_PATH + 'api/department';

  constructor(private apiService: ApiService) {
  }

  getDepartments(): Observable<any> {
    return this.apiService.get(this.baseUrl);
  }

  addDepartment(department: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, department);
  }

  updateDepartment(department: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, department);
  }

  deleteDepartment(id: any): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, id);
  }

  getDepartmentById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.post(this.baseUrl + '/download', {});
  }
}
