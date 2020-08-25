import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { Constants } from '../../constants-config';
import { ApiService } from './api.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  baseUrl = Constants.CONTEXT_PATH + 'login';
  private stompClient;
  private currentUtc2UserSubject: BehaviorSubject<User>;
  public currentUtc2User: Observable<User>;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.currentUtc2UserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUtc2User')));
    this.currentUtc2User = this.currentUtc2UserSubject.asObservable();
  }

  public get currentUtc2UserValue(): User {
    return this.currentUtc2UserSubject.value;
  }

  login(userName: string, passWord: string) {
    return this.apiService.post(this.baseUrl, { userName, passWord })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUtc2User', JSON.stringify(user));
        this.currentUtc2UserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUtc2User');
    this.currentUtc2UserSubject.next(null);
  }
}
