import { ChatBoxService } from './../../../core/services/chat-box.service';
import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  username: string;

  editProfile = true;
  editProfileIcon = 'icofont-edit';

  editAbout = true;
  editAboutIcon = 'icofont-edit';

  public basicContent: string;


  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  profitChartOption: any;

  constructor(private readonly chatBoxService: ChatBoxService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) {
  }

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    console.log("username", this.username);
    if (this.username) {
      this.getProfile();
    }
  }

  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
  }

  toggleEditAbout() {
    this.editAboutIcon = (this.editAboutIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editAbout = !this.editAbout;
  }

  doChat() {
    this.chatBoxService.display = true;
    this.chatBoxService.friend = this.username;
  }

  getProfile() {
    console.log("hi~~~~~~~~~~~~~~~~");
    this.userService.getUserByUsername(this.username).subscribe();
  }
}
