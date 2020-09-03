import { NotificationService } from './core/services/notification.service';
import { LoadingService } from './shared/services/loading.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthenticationService } from './core/services/authenticate.service';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { SocketService } from './core/services/socket.service';
import { Constants } from './constants-config';
import { Message } from './core/models/message';
import { ChatBoxService } from './core/services/chat-box.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Welcome ! UTC2 Social Network';
  currentUtc2User: any;
  private stompClient;
  private serverUrl = Constants.CONTEXT_PATH + 'socket';
  isLoaded = false;
  isCustomSocketOpened = false;
  private unsubcribe$ = new Subject<void>();

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private chatboxService: ChatBoxService) {
    this.authenticationService.currentUtc2User.subscribe(x => {
      this.currentUtc2User = x;
      if (this.currentUtc2User) {
        this.initializeWebSocketConnection();
      } else {
        this.disconnectWebsocket();
      }
    });
  }

  ngOnInit() {
    // this.initializeWebSocketConnection();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect(
      {name: this.currentUtc2User.username}, (frame) => {
      that.isLoaded = true;
      that.openGlobalSocket();
      that.openSocket();
    });
  }

  disconnectWebsocket() {
    this.stompClient.disconnect();
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/socket-publisher', (message) => {
      this.handleResult(message);

    // console.log(2222222222222222222222);
    });
  }

  openSocket() {
    if (this.isLoaded) {
      // this.isCustomSocketOpened = true;
      this.stompClient.subscribe('/socket-publisher/message/' +  this.currentUtc2User.username, (message) => {
        // this.handleResult(message);
      });

      // this.stompClient.subscribe('/socket-publisher/comment', (payload) => {
      //   this.handleComment(payload);
      //   console.log(2222222222222222222222);
      // });

      this.stompClient.subscribe('/socket-publisher/post/' + this.currentUtc2User.username, (payload) => {
        this.handleComment(payload);
        console.log(1111111111111111111);
      });
    }
  }

  handleComment(cmt) {
    console.log('----', cmt);
    if (cmt.body) {
      const cmtBody = JSON.parse(cmt.body);
      if(cmtBody.postUserId !== cmtBody.userId) {
        this.notificationService.notice = true;
      }
    }
  }

  handleResult(message) {
    console.log(message);
    if (message.body) {
      this.chatboxService.message = message;
      const messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      if (messageResult.fromId !== this.currentUtc2User.username) {
        this.chatboxService.notification = message;
      }
      if (messageResult.toId === this.currentUtc2User.username) {
        if (!this.chatboxService.display) {
          this.chatboxService.display = true;
          this.chatboxService.friend = messageResult.fromId;
        }
      }
      // this.messages.push(messageResult);
      // this.toastr.success("new message recieved", null, {
      //   'timeOut': 3000
      // });
    }
  }

  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }

}
