import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/services/user.service';
import { Constants } from '../../../../constants-config';
// import { Pagination } from 'src/app/core/models/pagination.model';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  user = {
    id: null,
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    group: '',
    department: '',
    birthDate: null,
    gender: null,
    phone: null,
    role: null,

  };
  birthDate = new Date();
  startDate = new Date();
  isEdit = false;
  listUser = [];
  page = 1;
  pageSize = Constants.PAGE_SIZE;
  pageSizeList = Constants.SIZE_LIST;
  collectionSize = 0;
  totalMoney = 0;
  lifeToast = 3000;
  searchCriterial = {
    fromDate: null,
    toDate: null,
    type: '',
    freeText: '',
  };
  listDelete = [];
  listCheckbox = [];
  isCheckAll: false;
  fileName: 'thu_chi.xlsx';

  constructor(private modalService: NgbModal,
              private readonly UserService: UserService,
              private readonly loadingService: LoadingService,
              private readonly confirmationService: ConfirmationService,
              private readonly messageService: MessageService) {}

  ngOnInit() {
    this.getDataDefault();
    console.log(this.page, this.pageSize);
  }

  getDataDefault() {
    this.isCheckAll = false;
    const pagination = {
      page: this.page,
      size: this.pageSize,
      fields: 'MONEY,DATE,CONTENT',
      searchValue: this.searchCriterial.freeText,
      orderBy: '',
      asc: false,
      type: this.searchCriterial.type,
      // fromDate: this.searchCriterial.fromDate ? this.searchCriterial.fromDate.toISOString() : null,
      // toDate: this.searchCriterial.toDate ? this.searchCriterial.toDate.toISOString() : null
    };
    this.loadingService.startLoading();
    this.UserService.getUsers().subscribe(res => {
      console.log(res);
      this.listUser = res;
      this.collectionSize = res.totalElements;
      this.listCheckbox.length = res.length;
      this.listCheckbox.fill(false);
      this.totalMoney = res.totalMoney;
      this.loadingService.stopLoading();
    }, err => {
      this.loadingService.stopLoading();
    });
  }

  openModal(content, size, UserId) {

    console.log(this.page);
    this.modalService.open(content, {size, centered: true });
    if (UserId) {
      this.isEdit = true;
      this.loadingService.startLoading();
      this.UserService.getUserById(UserId).subscribe(res => {
        this.user = res;
        console.log("user", res , this.user);
        this.loadingService.stopLoading();
      }, err => {
        this.loadingService.stopLoading();
      });
    } else {
      this.isEdit = false;
      this.clearModalData();
    }
  }

  clearModalData() {
    this.user = {
      id: null,
      firstName: '',
      lastName: '',
      fullName: '',
      email: '',
      group: '',
      department: '',
      birthDate: null,
      gender: null,
      phone: null,
      role: null,
    };
  }

  addUser(user, form): void {
    if (!form.invalid && form.submitted) {
      if (this.isEdit) {
        this.updateUser(user);
      } else {
        this.createUser(user);
        console.log(this.startDate);
      }
    }
  }

  updateUser(user) {
    const UserModel = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      group: user.group,
      department: user,
      birthDate: this.birthDate.toISOString(),
      gender: user.gender,
      phone: user.phone,
      role: user.role,

    };
    this.loadingService.startLoading();
    this.UserService.updateUser(UserModel).subscribe(() => {
      this.getDataDefault();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  createUser(user) {
    const UserModel = {
      money: user.money,
      date: this.startDate.toISOString(),
      content: user.content,
      type: user.type,
    };
    this.loadingService.startLoading();
    this.UserService.addUser(UserModel).subscribe(() => {
      this.getDataDefault();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  // clickPagination(page) {
  //   this.page = page;
  //   this.getDataDefault();
  // }

  pageChange(event: any): void {
    this.page = event.page;
    this.pageSize = event.size;
    this.getDataDefault();
  }

  // changePageSize(pageSize) {
  //   this.pageSize = pageSize;
  //   this.page = 1;
  //   this.getDataDefault();
  // }

  doDelete(user) {
    if (user) {
    this.listDelete.push(user);
    this.deleteRecords();
    } else {
      if (this.listCheckbox.every(e => e === false)) {
        this.messageService.add({
          severity: 'warn',
          detail: 'Vui lòng chọn ít nhất 1 mục để xóa',
          life: this.lifeToast
        });
      } else {
        for ( let i = 0; i < this.listCheckbox.length; i++) {
          if (this.listCheckbox[i] === true) {
            this.listDelete.push(this.listUser[i]);
          }
        }
        console.log(this.listDelete);
        this.deleteRecords();
      }
    }
  }

  deleteRecords() {
    this.confirmationService.confirm({
      header: 'Xóa Dữ Liệu',
      message: 'Bạn có chắc chắn muốn xóa dữ liệu ?',
      accept: () => {
        this.loadingService.startLoading();
        this.UserService.deleteUser(this.listDelete).subscribe(() => {
          this.messageService.add({
            severity: Constants.MSG_SUCCESS,
            detail: Constants.MSG_DETELE_SUCCESSFUL,
            life: this.lifeToast
          });
          this.modalService.dismissAll();
          this.getDataDefault();
          this.loadingService.stopLoading();
          this.listDelete.length = 0;
        }, err => {
          this.messageService.add({
            severity: Constants.MSG_ERROR,
            detail: Constants.MSG_DETELE_FAIL,
            life: this.lifeToast
          });
          this.modalService.dismissAll();
          this.loadingService.stopLoading();
          this.listDelete.length = 0;
        });
        }
    });
  }

  doSearch() {
    this.getDataDefault();
  }

  doExport() {
    this.confirmationService.confirm({
      header: 'Xuất Dữ Liệu',
      message: 'Bạn có chắc chắn muốn xuất file Excel ?',
      accept: () => {
        this.loadingService.startLoading();
        this.UserService.getExport().subscribe(res => {
          this.loadingService.stopLoading();
          const byteCharacters = atob(res.file);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = this.fileName;

          document.body.appendChild(link);

          link.click();

          document.body.removeChild(link);
          this.messageService.add({
            severity: Constants.MSG_SUCCESS,
            detail: Constants.MSG_EXPORT_SUCCESSFUL,
            life: this.lifeToast
          });
        }, err => {
          this.messageService.add({
            severity: Constants.MSG_ERROR,
            detail: Constants.MSG_EXPORT_FAIL,
            life: this.lifeToast
          });
          this.loadingService.stopLoading();
        });
      }
    });
  }

  doCheckAll() {
    if (this.listCheckbox.some(e => e === false) && this.isCheckAll) {
      for (let i = 0; i < this.listCheckbox.length; i++) {
        this.listCheckbox[i] = false;
      }
    } else if (this.listCheckbox.some(e => e === false) || !this.isCheckAll) {
      for (let i = 0; i < this.listCheckbox.length; i++) {
        this.listCheckbox[i] = true;
      }
    } else {
      for (let i = 0; i < this.listCheckbox.length; i++) {
        this.listCheckbox[i] = false;
      }
    }
  }

}

