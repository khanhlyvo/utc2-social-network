import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { User } from '../models/user.model';
import {Pagination} from '../models/pagination.model';

@Injectable()
export class UserService {
  baseUrl = Constants.CONTEXT_PATH + 'api/user';

  constructor(private apiService: ApiService) {
  }

  getUsers(): Observable<any> {
    return this.apiService.get(this.baseUrl);
  }

  addUser(user: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, user);
  }

  updateUser(user: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, user);
  }

  deleteUser(id: any): Observable<boolean> {
    return this.apiService.delete(`${this.baseUrl}/delete`, id);
  }

  getUserById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.post(this.baseUrl + '/download', {});
  }
}
