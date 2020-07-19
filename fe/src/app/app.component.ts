import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { AuthenticationService } from './core/services/authenticate.service';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { SocketService } from './core/services/socket.service';
import { Constants } from './constants-config';
import { Message } from './core/models/message';
import { ChatBoxService } from './core/services/chat-box.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Welcome ! UTC2 Social Network';
  currentUtc2User: any;
  private stompClient;
  private serverUrl = Constants.CONTEXT_PATH + 'socket';
  isLoaded = false;
  isCustomSocketOpened = false;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private chatboxService: ChatBoxService) {
    this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
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
    this.stompClient.connect({}, function (frame) {
      that.isLoaded = true;
      that.openGlobalSocket();
      that.openSocket();
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe('/socket-publisher', (message) => {
      this.handleResult(message);
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe('/socket-publisher/' +  this.currentUtc2User.username, (message) => {
        this.handleResult(message);
      });
    }
  }

  handleResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      // this.messages.push(messageResult);
      // this.toastr.success("new message recieved", null, {
      //   'timeOut': 3000
      // });
      if (!this.chatboxService.display) {
        this.chatboxService.display = true;
        this.chatboxService.friend = messageResult.fromId;
      }
    }
  }

}
