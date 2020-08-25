import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
// import { Group } from '../models/group.model';
// import {Pagination} from '../models/pagination.model';

@Injectable()
export class CommentService {
  baseUrl = Constants.CONTEXT_PATH + 'api/comment';

  constructor(private apiService: ApiService) {
  }

  getComments(userIds): Observable<any> {
    return this.apiService.put(`${this.baseUrl}/get`, userIds);
  }

  getCommentsByPostId(postId): Observable<any> {
    return this.apiService.get(`${this.baseUrl}/${postId}`);
  }

  // deleteFollow(follow): Observable<boolean> {
  //   return this.apiService.put(`${this.baseUrl}/delete`, follow);
  // }

  addComment(comment): Observable<any> {
    return this.apiService.post(this.baseUrl, comment);
  }


  updateComment(comment: any): Observable<boolean> {
    return this.apiService.put(this.baseUrl, comment);
  }

  deleteComment(id: any): Observable<boolean> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }

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
