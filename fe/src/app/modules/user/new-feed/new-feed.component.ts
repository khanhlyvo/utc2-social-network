import { UserService } from './../../../core/services/user.service';
import { AuthenticationService } from './../../../core/services/authenticate.service';
import { PostService } from './../../../core/services/post.service';
import { FollowService } from './../../../core/services/follow.service';
import { CommentService } from './../../../core/services/comment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-new-feed',
  templateUrl: './new-feed.component.html',
  styleUrls: ['./new-feed.component.scss']
})
export class NewFeedComponent implements OnInit, OnDestroy {
  private unsubcribe$ = new Subject<void>();
  postInput = '';
  postList = [];
  postListOrigin = [];
  followSubscription: Subscription;
  listFollowId = [];
  followList = [];
  userProfile;
  isSeeMore = false;
  postSubscription: Subscription;
  currentUtc2User: any;
  pageSize = 10;
  pageNo = 0;
  constructor(
    private readonly followService: FollowService,
    private commentService: CommentService,
    private postService: PostService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
   }

  ngOnInit() {
    this.followSubscription = this.followService.list.subscribe(list => {
      this.getFollow();
    });
    this.postSubscription = this.postService.isFetch.subscribe(fetch => {
      if (fetch) {
        this.getPost(0);
      }
    });
    this.getFollow();
    this.getProfile();
  }

  getProfile() {
    this.userService.getUserByUsername(this.currentUtc2User.username).subscribe(res => {
      this.userProfile = res;
    });
  }

  seeMore() {
    this.pageNo++;
    console.log(this.pageNo);
    this.getPost(this.pageNo);
  }

  getFollow() {
    this.listFollowId.length = 0;
    this.followService.followList.forEach(e => {
      this.listFollowId.push(e.id);
    });
    this.listFollowId.push(+this.currentUtc2User.id);
    console.log('listFollowId', this.listFollowId);
    this.getPost(0);
  }

  doPost() {
    if (this.postInput.trim() === '') { return; }
    console.log(this.postInput);
    // const param = null;
    const param = {
      userId: +this.currentUtc2User.id,
      content: this.postInput,
    };
    this.postService.addPost(param).subscribe(() => {
      this.postInput = '';
      this.getPost(0);
    });
  }

  getPost(pageNo) {
    if (pageNo === 0) {
      this.pageNo = 0;
      this.postListOrigin.length = 0;
    }
    this.postService.getPosts(this.listFollowId, this.pageSize, pageNo).subscribe(res => {
      if ( res.length === 0) {
        this.isSeeMore = false;
      } else {
        this.isSeeMore = true;
      }
      this.postListOrigin = [...this.postListOrigin, ...res];
      this.postList = [...this.postListOrigin];
      // this.postList = this.postListOrigin.sort( (a, b) => {
      //   return (new Date(b.created).getTime()) - new Date(a.created).getTime();
      // });
    });
  }

  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }
}
