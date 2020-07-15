import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Message } from '../models/message';
import { Constants } from '../../constants-config';

@Injectable()
export class SocketService {
  baseUrl =  Constants.CONTEXT_PATH + 'api/socket';

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post(this.baseUrl, data)
      .map((data: Message) => data)
      .catch(error => {
        return new ErrorObservable(error);
      })
      ;
  }
}
