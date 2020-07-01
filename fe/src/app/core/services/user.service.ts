import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { User } from '../models/user.model';
import {Pagination} from '../models/pagination.model';

@Injectable()
export class UserService {
  baseUrl = Constants.CONTEXT_PATH + 'user';

  constructor(private apiService: ApiService) {
  }

  getUsers(pagination: Pagination): Observable<any> {
    return this.apiService.get(`${this.baseUrl}`, pagination);
  }

  addUser(user: User): Observable<User> {
    return this.apiService.post(this.baseUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.apiService.put(this.baseUrl, user);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.apiService.delete(this.baseUrl + '/' + id);
  }
}
