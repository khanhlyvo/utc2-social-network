import { FollowService } from './../../../core/services/follow.service';
import { ChatBoxService } from './../../../core/services/chat-box.service';
import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthenticationService } from '../../../core/services/authenticate.service';
import { User } from '../../../core/models/user.model';

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
  birthDate = null;

  userProfile;
  userProfileEdit;
  currentUtc2User: any;
  avatar;
  background;

  constructor(private readonly chatBoxService: ChatBoxService,
    private readonly followService: FollowService,
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
        if (background) {
          this.background = reader.result;
        } else {
          this.avatar = reader.result;
        }
      };
    }
  }

  changeImage(background) {
    const params = {...this.userProfile};
    if (background) {
      params.background = this.background;
      delete params.avatar;
    } else {
      params.avatar = this.avatar;
      delete params.background;
    }
    this.userService.updateUser(params).subscribe(() => {
      this.getProfile();
      this.avatar = null;
      this.background = null;
    });
  }

  get srcBackground() {
    let src = 'assets/images/user-profile/bg-img1.jpg';
    if (this.background) {
      src = this.background;
    } else {
      src = this.userProfile ? this.userProfile.background : 'assets/images/user-profile/bg-img1.jpg';
    }
    return src;
  }

  get srcAvatar() {
    let src = 'assets/images/user-profile/user-img.jpg';
    if (this.avatar) {
      src = this.avatar;
    } else {
      src = this.userProfile ? this.userProfile.avatar : 'assets/images/user-profile/user-img.jpg';
    }
    return src;
  }

  deleteImage(background) {
    this.avatar = null;
    this.background = null;
  }

  toggleEditProfile() {
    this.editProfileIcon = (this.editProfileIcon === 'icofont-close') ? 'icofont-edit' : 'icofont-close';
    this.editProfile = !this.editProfile;
    this.birthDate = new Date(this.userProfile.birthDate);
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
    this.userService.getUserByUsername(this.username).subscribe(res => {
      this.userProfile = res;
      this.userProfileEdit = {...res};
      if (!this.userProfile.avatar) {
        this.userProfile.avatar = 'assets/images/user-profile/user-img.jpg';
      }
      if (!this.userProfile.background) {
        this.userProfile.background = 'assets/images/user-profile/bg-img1.jpg';
      }
    });
  }

  get isFollowed() {
    const followList = this.followService.followList;
    return followList.some(e => e && this.userProfile && e.userName === this.userProfile.userName);
  }

  doFollow() {
    console.log(1);
    const param = {
      followee: this.userProfile.userName,
      follower: this.currentUtc2User.username,
    };
    this.followService.addFollow(param).subscribe(() => {
      console.log(param);
      this.followService.fetch = true;
    });
  }

  doUnFollow() {
    const param = {
      followee: this.userProfile.userName,
      follower: this.currentUtc2User.username,
    };
    this.followService.deleteFollow(param).subscribe(() => {
      console.log(param);
      this.followService.fetch = true;
    });
  }


  doSave() {
    let gender;
    if (this.userProfileEdit.gender === 'Nữ') {
      gender = '2';
    } else if (this.userProfileEdit.gender === 'Nam') {
      gender = '1';
    } else {
      gender = '0';
    }
    const user = {...this.userProfile};
    user.phone = this.userProfileEdit.phone;
    user.gender = gender;
    user.birthDate = this.birthDate ? this.birthDate.toISOString() : null;
    this.userService.updateUser(user).subscribe(() => {
      this.getProfile();
      this.editProfile = !this.editProfile;
    });
  }
}
