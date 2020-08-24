import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Group } from '../models/group.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class PresenceService {
  baseUrl = Constants.CONTEXT_PATH + 'api/presence';

  constructor(private apiService: ApiService) {
  }

  getPresences(): Observable<any> {
    return this.apiService.get(this.baseUrl);
  }

  // deleteFollow(follow): Observable<boolean> {
  //   return this.apiService.put(`${this.baseUrl}/delete`, follow);
  // }

  // addFollow(follow): Observable<boolean> {
  //   return this.apiService.post(this.baseUrl, follow);
  // }

  // get followList() {
  //   return this._followList;
  // }

  // set fetch(value: any) {
  //   this.isFetch.next(value);
  // }

  // set followList(value: any) {
  //   this._followList = value;
  // }
}
