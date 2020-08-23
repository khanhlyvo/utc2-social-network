import { ChatBoxService } from './../../../core/services/chat-box.service';
import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authenticate.service';

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

  userProfile;
  currentUtc2User: any;
  avatar;
  background;

  constructor(private readonly chatBoxService: ChatBoxService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
  }

  ngOnInit() {
    this.username = this.route.snapshot.params['username'];
    console.log('username', this.username);
    if (this.username) {
      this.getProfile();
    }
  }

  onSelectFile(event, background) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onloadend = (e) => { // called once readAsDataURL is completed
        if(background) {
          this.background = reader.result;
        } else {
          this.avatar = reader.result;
        }
      };
    }
  }

  changeImage(background) {
    const params = {...this.userProfile};
    console.log(params);
    if(background) {
      params.background = this.background;
      delete params.avatar;
    } else {
      params.avatar = this.avatar;
      delete params.background;
    }
    this.userService.updateUser(params).subscribe ( () => {
      this.getProfile();
      this.avatar = null;
      this.background = null;
    });
  }

  deleteImage(background) {
    this.avatar = null;
    this.background = null;
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
    console.log('hi~~~~~~~~~~~~~~~~');
    this.userService.getUserByUsername(this.username).subscribe(res => {
      this.userProfile = res;
      if (!this.userProfile.avatar) {
        this.userProfile.avatar = 'assets/images/user-profile/user-img.jpg';
      }
      if (!this.userProfile.background) {
        this.userProfile.background = 'assets/images/user-profile/bg-img1.jpg';
      }
    });
  }
}
