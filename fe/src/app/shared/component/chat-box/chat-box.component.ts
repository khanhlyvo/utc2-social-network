import { ChatBoxService } from './../../../core/services/chat-box.service';
import { Component, OnInit, Input, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { SocketService } from '../../../core/services/socket.service';
// import { ToastrService } from 'ngx-toastr';
import { Message } from '../../../core/models/message';
import { Constants } from '../../../constants-config';
import { AuthenticationService } from '../../../core/services/authenticate.service';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy {

  // @Input() friendId;
  // @Output() onChatToggle = new EventEmitter();
  @ViewChild('newChat', {static: false, read: ElementRef}) public newChat: ElementRef;
  @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
  public friendsList: any;
  public userChat: any;
  public chatMessage: any;
  public message: string;
  public message_error: boolean;
  public friendWriting: boolean;
  public newReplay: any;
  display = false;
  displaySubscription: Subscription;
  friendSubscription: Subscription;

  currentUtc2User;
  isCustomSocketOpened = false;
  private stompClient;
  private serverUrl = Constants.CONTEXT_PATH + 'socket';
  isLoaded = false;
  messages: Message[] = [];
  friendId;
  friend;

  constructor(private readonly chatBoxService: ChatBoxService,
    private socketService: SocketService,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
    this.newReplay = '';
    this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
  }

  ngOnInit() {
    // this.initializeWebSocketConnection();
    this.displaySubscription = this.chatBoxService.isDisplay.subscribe((value) => {
      this.display = value;
    });
    this.friendSubscription = this.chatBoxService.friendId.subscribe(value => {
      this.friendId = value;
      this.userService.getUserByUsername(this.friendId).subscribe( res => {
        this.friend = res;
        console.log("friend", this.friend);
      });
    })
    this.chatMessage = {
      chat: [
        {msg: 'ádasdasd',
          time: '26/01/1993'
        }
      ],
      photo: '',
      name: '',
    };
    console.log("username" + this.friendId);

  }

  sendMessageUsingSocket() {
    // if (this.form.valid) {
      const message: Message = { message: this.message, fromId: this.currentUtc2User.username, toId: this.friendId };
      this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(message));
    // }
  }

  sendMessageUsingRest() {
    // if (this.form.valid) {
      const message: Message = { message: this.message, fromId: this.currentUtc2User.username, toId: this.friendId };
      this.socketService.post(message).subscribe(res => {
        console.log(res);
      });
    // }
  }

  // initializeWebSocketConnection() {
  //   const ws = new SockJS(this.serverUrl);
  //   this.stompClient = Stomp.over(ws);
  //   const that = this;
  //   this.stompClient.connect({}, function (frame) {
  //     that.isLoaded = true;
  //     that.openGlobalSocket();
  //     that.openSocket();
  //   });
  // }

  // openGlobalSocket() {
  //   this.stompClient.subscribe('/socket-publisher', (message) => {
  //     this.handleResult(message);
  //   });
  // }

  // openSocket() {
  //   if (this.isLoaded) {
  //     this.isCustomSocketOpened = true;
  //     this.stompClient.subscribe('/socket-publisher/' +  this.currentUtc2User.username, (message) => {
  //       this.handleResult(message);
  //     });
  //   }
  // }

  handleResult(message) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      console.log(messageResult);
      // this.messages.push(messageResult);
      // this.toastr.success("new message recieved", null, {
      //   'timeOut': 3000
      // });
      let chatStyle = messageResult.fromId === this.currentUtc2User.username ? 'chat-menu-reply' :
        'chat-menu-content';
      let html_replay;
          html_replay = `<div class="media chat-messages">
            <div class="media-body ${chatStyle}">
            <div class="">

            <div class="">
            <p class="chat-cont mb-0"> ${messageResult.message}
            </div>

            </div>
            </div>
            </div>`;
          this.newReplay = this.newReplay + html_replay;
    }
  }

  isDisplay(value) {
    this.chatBoxService.display = value;
  }

  ngOnDestroy(): void {
    this.displaySubscription.unsubscribe();
    this.friendSubscription.unsubscribe();
  }

  sentMsg(flag) {
    console.log(this.message);
    if (this.message === '' || this.message === undefined) {
      this.message_error = true;
      // if(false){
    } else {
      if (flag === 1) {
        this.message_error = false;
      } else {
        this.sendMessageUsingSocket();
        // this.sendMessageUsingRest();
        this.message_error = false;
        const temp_replay = this.message;
        let html_send;
        html_send = '<div class="media chat-messages">' +
          '<div class="media-body chat-menu-reply">' +
            '<div class="">' +
              '<p class="chat-cont">' + this.message + '</p>' +
            '</div>' +
            '<p class="chat-time">now</p>' +
          '</div>' +
        '</div>';
        console.log(1);
        // this.newReplay = this.newReplay + html_send;
        this.message = '';

        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom();
        }, 100);
        this.friendWriting = true;
        // setTimeout(() => {
        //   this.friendWriting = false;

        //   let html_replay;
        //   html_replay = '<div class="media chat-messages">' +
        //     '<a class="media-left photo-table" href="javascript:">' +
        //     '<img class="media-object img-radius img-radius m-t-5" src="' + this.chatMessage.photo + '" alt="' + this.chatMessage.name + '">' +
        //     '</a>' +
        //     '<div class="media-body chat-menu-content">' +
        //     '<div class="">' +
        //     '<p class="chat-cont">hello superior personality you write</p>' +
        //     '<p class="chat-cont">' + temp_replay + '</p>' +
        //     '</div>' +
        //     '<p class="chat-time">now</p>' +
        //     '</div>' +
        //     '</div>';
        //   this.newReplay = this.newReplay + html_replay;
        //   setTimeout(() => {
        //     this.componentRef.directiveRef.scrollToBottom();
        //   }, 100);
        // }, 3000);
      }
    }
  }

}

function findObjectByKeyValue(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return false;
}
