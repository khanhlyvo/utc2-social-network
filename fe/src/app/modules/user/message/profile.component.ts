// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';

// import * as Stomp from 'stompjs';
// import * as SockJS from 'sockjs-client';
// import { SocketService } from '../../../core/services/socket.service';
// // import { ToastrService } from 'ngx-toastr';
// import { Message } from '../../../core/models/message';
// import { Constants } from '../../../constants-config';
// import { AuthenticationService } from '../../../core/services/authenticate.service';

// @Component({
//   selector: 'app-profile',
//   templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss'],
// })
// export class ProfileComponent implements OnInit {
//   private serverUrl = Constants.CONTEXT_PATH + 'socket';
//   isLoaded = false;
//   isCustomSocketOpened = false;
//   private stompClient;
//   private form: FormGroup;
//   private userForm: FormGroup;
//   messages: Message[] = [];
//   currentUtc2User: any;

//   constructor(private socketService: SocketService,
//   private authenticationService: AuthenticationService
//     // private toastr: ToastrService
//   ) {

//     this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
//   }

//   ngOnInit() {
//     this.form = new FormGroup({
//       message: new FormControl(null, [Validators.required])
//     });
//     this.userForm = new FormGroup({
//       fromId: new FormControl(null, [Validators.required]),
//       toId: new FormControl(null)
//     });
//     this.initializeWebSocketConnection();
//   }

//   sendMessageUsingSocket() {
//     if (this.form.valid) {
//       const message: Message = { message: this.form.value.message, fromId: this.currentUtc2User.id, toId: '4' };
//       this.stompClient.send('/socket-subscriber/send/message', {}, JSON.stringify(message));
//     }
//   }

//   sendMessageUsingRest() {
//     if (this.form.valid) {
//       const message: Message = { message: this.form.value.message, fromId: this.currentUtc2User.id, toId: '4' };
//       this.socketService.post(message).subscribe(res => {
//         console.log(res);
//       });
//     }
//   }

//   initializeWebSocketConnection() {
//     const ws = new SockJS(this.serverUrl);
//     this.stompClient = Stomp.over(ws);
//     const that = this;
//     this.stompClient.connect({}, function (frame) {
//       that.isLoaded = true;
//       that.openGlobalSocket();
//       that.openSocket();
//     });
//   }

//   openGlobalSocket() {
//     this.stompClient.subscribe('/socket-publisher', (message) => {
//       this.handleResult(message);
//     });
//   }

//   openSocket() {
//     if (this.isLoaded) {
//       this.isCustomSocketOpened = true;
//       this.stompClient.subscribe('/socket-publisher/' +  this.currentUtc2User.id, (message) => {
//         this.handleResult(message);
//       });
//     }
//   }

//   handleResult(message) {
//     if (message.body) {
//       const messageResult: Message = JSON.parse(message.body);
//       console.log(messageResult);
//       this.messages.push(messageResult);
//       // this.toastr.success("new message recieved", null, {
//       //   'timeOut': 3000
//       // });
//     }
//   }
// }
