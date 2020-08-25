import { LogLevel } from './../../services/logger.service';
import { Message } from './../../../core/models/message';
import { ChatBoxService } from './../../../core/services/chat-box.service';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { SocketService } from '../../../core/services/socket.service';
// import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../constants-config';
import { AuthenticationService } from '../../../core/services/authenticate.service';
import { UserService } from '../../../core/services/user.service';
import { Observable, Observer, Subject } from 'rxjs';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() friendId;
  // @Output() onChatToggle = new EventEmitter();
  @ViewChild('newChat', { static: false, read: ElementRef })
  public newChat: ElementRef;
  @ViewChild(PerfectScrollbarComponent, { static: false })
  componentRef?: PerfectScrollbarComponent;
  // @ViewChild(PerfectScrollbarDirective, {static: false}) directiveScroll: PerfectScrollbarDirective;
  // @ViewChild('perfectScroll', {static: false}) perfectScroll: PerfectScrollbarComponent;

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
  stompSubscription: Subscription;
  private unsubcribe$ = new Subject<void>();

  fileToUpload: File = null;
  image;
  fileName;
  currentUtc2User;
  isCustomSocketOpened = false;
  private stompClient;
  private serverUrl = Constants.CONTEXT_PATH + 'socket';
  isLoaded = false;
  messages = [];
  messagesOrigin = [];
  friendId;
  friend;
  scrollConfig = {
    scrollToTop: true,
  };

  pageSize = 50;
  pageNo = 0;
  startChat = false;

  constructor(
    private readonly chatBoxService: ChatBoxService,
    private socketService: SocketService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    Window['myComponent'] = this;
    this.newReplay = '';
    this.authenticationService.currentUtc2User.subscribe(
      (x) => (this.currentUtc2User = x)
    );
  }

  ngOnInit() {
    this.displaySubscription = this.chatBoxService.isDisplay.subscribe(
      (display) => {
        this.startChat = false;
        this.messages.length = 0;
        this.messagesOrigin.length = 0;
        this.display = display;
      }
    );
    this.stompSubscription = this.chatBoxService.isNewMes.subscribe(isNew => {
      if (isNew) {
        console.log(11111111111111111);
        this.handleResult(this.chatBoxService.message);
      }
    });
    this.friendSubscription = this.chatBoxService.friendId.subscribe(
      (value) => {
        this.startChat = false;
        this.messages.length = 0;
        this.messagesOrigin.length = 0;
        this.friendId = value;
        this.userService.getUserByUsername(this.friendId).subscribe((res) => {
          this.friend = res;
        });
        if (this.display && this.friendId) {
          this.getMessages(0);
        }
      }
    );
    console.log('username' + this.friendId);
  }

  getMessages(pageNo) {
    if (pageNo === 0) {
      this.pageNo = 0;
      this.messages.length = 0;
      this.messagesOrigin.length = 0;
    }
    this.socketService
    .getMessage(this.currentUtc2User.username, this.friendId, pageNo, this.pageSize)
    .subscribe((res) => {
      this.messagesOrigin = this.messagesOrigin.concat(res);
      this.messages = this.messagesOrigin.slice(0);
      this.messages.reverse();
      this.newReplay = '';
      if (pageNo === 0) {
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom();
          this.startChat = true;
          this.pageNo = 1;
        }, 0);
      } else {
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToTop(1000);
        }, 0);
      }
    });
  }

  ngAfterViewInit() {
    if (this.componentRef) {
      this.componentRef.directiveRef.scrollToBottom();
    }
  }

  onScrollUp() {
    if (this.pageNo > 0) {
      this.pageNo++;
      this.getMessages(this.pageNo - 1);
    }
  }

  deleteImg() {
    this.image = null;
    this.fileName = null;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.readThis(this.fileToUpload);
  }

  readThis(file): void {
    this.fileName = file.name;
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.image = myReader.result;
      console.log(this.image);
    };
    myReader.readAsDataURL(file);
  }

  sendMessage() {
    let type;
    if (this.image) {
      if (this.image.includes('data:image')) {
        type = 'image';
      } else {
        type = 'file';
      }
    } else {
      type = '';
    }
    const param = {
      messageType: 'chat',
      message: this.message,
      fromId: this.currentUtc2User.username,
      toId: this.friendId,
      image: this.image,
      seen: false,
      fileName: this.fileName,
      type: type,
    };
    this.socketService.sendMessage(param).subscribe((res) => {
      console.log(res, '========================================');
      this.image = null;
      this.fileName = null;
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
  //     if(this.currentUtc2User) {
  //       this.stompClient.subscribe(
  //         '/socket-publisher/' + this.currentUtc2User.username,
  //         (message) => {
  //           this.handleResult(message);
  //         }
  //       );
  //     }
  //   }
  // }

  handleResult(message) {
    console.log("12345");
    if (message.body) {
      const messageResult = JSON.parse(message.body);
      let displayContent = '';
      console.log(messageResult);
      // this.messages.push(messageResult);
      // this.toastr.success("new message recieved", null, {
      //   'timeOut': 3000
      // });
      const chatStyle =
        messageResult.fromId === this.currentUtc2User.username
          ? 'chat-menu-reply'
          : 'chat-menu-content';
      let html_replay;
      if (!!messageResult.image) {
        // displayContent = `<img src=${messageResult.image} height="60px" width="auto" (click)="Window.myComponent.doClickFile()" alt="">`;
        this.getMessages(0);
          return;
      }
      if (!!messageResult.message) {
        displayContent =
          // displayContent +
          `<span class="chat-cont mb-0" > ${messageResult.message} </span>`;
      }
      html_replay = `<div class="media chat-messages">
            <div class="media-chat ${chatStyle}">

            <div class="p-2">${displayContent}
            </div>

            </div>
            </div>`;
      this.newReplay = this.newReplay + html_replay;
      // }
      setTimeout(() => {
        this.componentRef.directiveRef.scrollToBottom();
      }, 100);
    }
  }

  doClickImg(data, name) {
    const w = window.open('about:blank');
    if (data.includes('application/pdf') || data.includes('data:image')) {
        setTimeout(function() {
          w.document.body.appendChild(w.document.createElement('iframe'))
              .src = data;
          const ifr =  w.document.getElementsByTagName('iframe')[0];
          ifr.style.width = 'calc(100vw - 24px)';
          ifr.style.height = 'calc(100vh - 24px)';
          ifr.name = name;
      }, 0);
    } else {
      this.saveContent(data, name);
    }

  }

  saveContent(fileContents, fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = fileContents;
    link.click();
  }

  isDisplay(value) {
    this.chatBoxService.display = value;
    this.startChat = false;
    this.pageNo = 0;
  }

  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }

  sentMsg(flag) {
    console.log(this.message);
    if (!this.message && !this.image || ((this.message.trim() === '')  && !this.image)) {
      this.message_error = true;
      // if(false){
    } else {
      if (flag === 1) {
        this.message_error = false;
      } else {
        this.sendMessage();
        console.log(1);
        this.message_error = false;
        const temp_replay = this.message;
        // let html_send;
        // html_send = '<div class="media chat-messages">' +
        //   '<div class="media-body chat-menu-reply">' +
        //     '<div class="">' +
        //       '<p class="chat-cont">' + this.message + '</p>' +
        //     '</div>' +
        //     '<p class="chat-time">now</p>' +
        //   '</div>' +
        // '</div>';
        // console.log(1);
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
