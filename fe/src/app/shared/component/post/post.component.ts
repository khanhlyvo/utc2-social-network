import { PostService } from './../../../core/services/post.service';
import { LoadingService } from './../../services/loading.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from './../../../core/services/user.service';
import { CommentService } from './../../../core/services/comment.service';
import { AuthenticationService } from './../../../core/services/authenticate.service';
import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../../../src/app/constants-config';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() item;
  currentUtc2User: any;
  listComment = [];
  commentInput: '';
  userProfile;
  isEdit = [];
  isLoaded = false;
  isEditPost = false;
  pageSize = 10;
  pageNo = 0;
  constructor(
    private messageService: MessageService,
    private postService: PostService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private commentService: CommentService,
    private loadingService: LoadingService,
    private userService: UserService,
  ) {
    this.authenticationService.currentUtc2User.subscribe(x => this.currentUtc2User = x);
  }

  ngOnInit() {
    // this.getCmtByPostId();
    this.getProfile();
    console.log('item', this.item);
    // if(this.item && this.item.comments) {
      this.item.comments = this.item.comments.filter(e => e && !e.flgDel);
    // }
  }

  doCmt(value, item, isEdit) {
    if (!value) {return; }
    if (!isEdit) {
    const param = {
      userId: +this.currentUtc2User.id,
      postId: item.id,
      content: value
    };
      this.commentService.addComment(param).subscribe(res => {
        console.log(res);
        this.commentInput = '';
        this.getCmtByPostId();
      });
    } else {
      const param = {
        content: value,
        id: item.id,
      };
      this.commentService.updateComment(param).subscribe(_res => {
        this.getCmtByPostId();
        this.isEdit.fill(false);
      // tslint:disable-next-line: no-unused-expression
      }), () => {
        this.isEdit.fill(false);
      };
    }
  }

  updatePost(value) {
    const param = {
      content: value,
      id: this.item.id,
    };
    this.postService.updatePost(param).subscribe(_res => {
      this.postService.fetch = true;
      this.isEditPost = false;
    // tslint:disable-next-line: no-unused-expression
    }), _err => {
      this.isEditPost = false;
    };
  }

  deletePost() {
    this.confirmationService.confirm({
      header: 'Xóa Bình Luận',
      message: 'Bạn có chắc chắn muốn xóa bình luận này?',
      accept: () => {
        this.commentService.deleteComment(this.item.id).subscribe(() => {
          this.postService.fetch = true;
        }, _err => {});
      }
    });
  }

  getCmtByPostId() {
    this.loadingService.startLoading();
    this.commentService.getCommentsByPostId(this.item.id).subscribe(res => {
      console.log('commnet', res);
      this.listComment = res.filter(e => !e.flgDel);
      this.isEdit.length = this.listComment.length;
      this.loadingService.stopLoading();
    }),
      // tslint:disable-next-line: no-unused-expression
      () => {
      this.loadingService.stopLoading();
    };
  }

  getProfile() {
    console.log(this.item, '@@@');
    this.userService.getUserById(this.item.userId).subscribe(res => {
      this.userProfile = res;
    });
  }

  doDelete(id) {
    this.confirmationService.confirm({
      header: 'Xóa Bình Luận',
      message: 'Bạn có chắc chắn muốn xóa bình luận này?',
      accept: () => {
        this.commentService.deleteComment(id).subscribe(() => {
          this.getCmtByPostId();
        }, _err => {});
      }
    });
  }
}
