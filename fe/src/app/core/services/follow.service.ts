import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Group } from '../models/group.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class FollowService {
  baseUrl = Constants.CONTEXT_PATH + 'api/follow';
  isFetch: Subject<boolean> = new Subject();
  list: Subject<any> = new Subject();
  private _followList = [];

  constructor(private apiService: ApiService) {
  }

  getFollows(username): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + username);
  }

  deleteFollow(follow): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, follow);
  }

  addFollow(follow): Observable<boolean> {
    return this.apiService.post(this.baseUrl, follow);
  }

  get followList() {
    return this._followList;
  }

  set fetch(value: any) {
    this.isFetch.next(value);
  }

  set followList(value: any) {
    this._followList = value;
    this.list.next(value);
  }


}
