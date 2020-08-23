import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Group } from '../models/group.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class GroupService {
  baseUrl = Constants.CONTEXT_PATH + 'api/group';

  constructor(private apiService: ApiService) {
  }

  getGroups(pagination): Observable<any> {
    return this.apiService.get(`${this.baseUrl}`, pagination);
  }

  addGroup(group: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, group);
  }

  updateGroup(group: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, group);
  }

  deleteGroup(id: any): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, id);
  }

  getGroupById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.post(this.baseUrl + '/download', {});
  }

  getDepartByGroupId(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id + '/department');
  }
}
