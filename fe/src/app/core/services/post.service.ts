import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Group } from '../models/group.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class PostService {
  baseUrl = Constants.CONTEXT_PATH + 'api/post';
  isFetch: Subject<boolean> = new Subject();
  constructor(private apiService: ApiService) {
  }

  getPosts(userIds, pageSize, pageNo): Observable<any> {
    return this.apiService.put(`${this.baseUrl}/get/${pageSize}/${pageNo}`, userIds);
  }

  // deleteFollow(follow): Observable<boolean> {
  //   return this.apiService.put(`${this.baseUrl}/delete`, follow);
  // }

  addPost(post): Observable<any> {
    return this.apiService.post(`${this.baseUrl}/insert`, post);
  }

  updatePost(post: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, post);
  }

  deletePost(id: any): Observable<boolean> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }


  // get followList() {
  //   return this._followList;
  // }

  set fetch(value: any) {
    this.isFetch.next(value);
  }

  // set followList(value: any) {
  //   this._followList = value;
  // }
}
