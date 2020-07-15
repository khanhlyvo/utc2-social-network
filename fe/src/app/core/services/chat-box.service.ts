import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';

@Injectable()
export class ChatBoxService {
  baseUrl = Constants.CONTEXT_PATH + 'card';

  constructor(private apiService: ApiService) {
  }
  isDisplay: Subject<boolean> = new Subject();
  friendId: Subject<string> = new Subject();

  private _display = false;
  private _friend = '';

  get display() {
    return this._display;
  }

  set display(value: any) {
    this._display = value;
    this.isDisplay.next(value);
  }

  get friend() {
    return this._friend;
  }

  set friend(value: any) {
    this._friend = value;
    this.friendId.next(value);
  }

}
