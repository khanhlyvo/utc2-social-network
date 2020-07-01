import { ChatBoxService } from './../../../core/services/chat-box.service';
import { Component, OnInit, Input, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';


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
  constructor(private readonly chatBoxService: ChatBoxService) {
    this.newReplay = '';
  }

  ngOnInit() {
    this.displaySubscription = this.chatBoxService.isDisplay.subscribe((value) => {
      this.display = value;
    });
    this.chatMessage = {
      chat: [
        {msg: 'ádasdasd',
          time: '26/01/1993'
        }
      ],
      photo: '',
      name: '',
    };
  }

  isDisplay(value) {
    this.chatBoxService.display = value;
  }

  ngOnDestroy(): void {
    this.displaySubscription.unsubscribe();
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
        this.newReplay = this.newReplay + html_send;
        this.message = '';

        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom();
        }, 100);
        this.friendWriting = true;
        setTimeout(() => {
          this.friendWriting = false;

          let html_replay;
          html_replay = '<div class="media chat-messages">' +
            '<a class="media-left photo-table" href="javascript:">' +
            '<img class="media-object img-radius img-radius m-t-5" src="' + this.chatMessage.photo + '" alt="' + this.chatMessage.name + '">' +
            '</a>' +
            '<div class="media-body chat-menu-content">' +
            '<div class="">' +
            '<p class="chat-cont">hello superior personality you write</p>' +
            '<p class="chat-cont">' + temp_replay + '</p>' +
            '</div>' +
            '<p class="chat-time">now</p>' +
            '</div>' +
            '</div>';
          this.newReplay = this.newReplay + html_replay;
          setTimeout(() => {
            this.componentRef.directiveRef.scrollToBottom();
          }, 100);
        }, 3000);
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
