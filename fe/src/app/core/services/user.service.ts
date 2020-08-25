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

  getUsers(pagination): Observable<any> {
    return this.apiService.get(`${this.baseUrl}`, pagination);
  }

  addUser(user: any): Observable<boolean> {
    return this.apiService.post(this.baseUrl, user);
  }

  addListUser(file): Observable<boolean> {
    return this.apiService.postOption(`${this.baseUrl}/import`, file , { 'Content-Type': 'multipart/form-data' });
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

  getUserByUsername(userName: string): Observable<any> {
    return this.apiService.get(this.baseUrl + '/username/' + userName);
  }

  getExport(): Observable<any> {
    return this.apiService.post(this.baseUrl + '/download', {});
  }

  getUserByIdOrName(name: string): Observable<any> {
    return this.apiService.get(this.baseUrl + '/search-name/' + name);
  }

  resetPwd(id, password): Observable<boolean> {
    return this.apiService.post(`${this.baseUrl}/password-reset?id=${id}`, password);
  }

}
