import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Message } from '../models/message';
import { Constants } from '../../constants-config';
import { ApiService } from './api.service';

@Injectable()
export class SocketService {
  baseUrl =  Constants.CONTEXT_PATH + 'api/message';

  constructor(private apiService: ApiService) {
  }

  sendMessage(data) {
    return this.apiService.post(this.baseUrl, data);
  }

  getMessage(toId, fromId, pageNo, pageSize) {
    return this.apiService.get(this.baseUrl + '/' + toId + '/' + fromId + '/' + pageNo + '/' + pageSize);
  }
}
