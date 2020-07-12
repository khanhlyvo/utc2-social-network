import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../core/services/user.service';
import { Constants } from '../../../../constants-config';
// import { Pagination } from 'src/app/core/models/pagination.model';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GroupService } from '../../../../core/services/group.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { zip } from 'rxjs';
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
    department: '',
    birthDate: null,
    gender: 0,
    phone: null,
    role: null,
    passWord: '',
    userName: null,

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
  listDepartment;
  listDepartOrigin;
  listGroup: [];
  groupSelected: null;

  constructor(private modalService: NgbModal,
              private readonly userService: UserService,
              private readonly departmentService: DepartmentService,
              private readonly groupService: GroupService,
              private readonly loadingService: LoadingService,
              private readonly confirmationService: ConfirmationService,
              private readonly messageService: MessageService) {}

  ngOnInit() {
    this.getDataDefault();
    console.log(this.page, this.pageSize);
  }

  getDataDefault() {
    this.isCheckAll = false;
    // const pagination = {
    //   page: this.page,
    //   size: this.pageSize,
    //   fields: 'MONEY,DATE,CONTENT',
    //   searchValue: this.searchCriterial.freeText,
    //   orderBy: '',
    //   asc: false,
    //   type: this.searchCriterial.type,
    //   // fromDate: this.searchCriterial.fromDate ? this.searchCriterial.fromDate.toISOString() : null,
    //   // toDate: this.searchCriterial.toDate ? this.searchCriterial.toDate.toISOString() : null
    // };
    zip(this.userService.getUsers(),
    this.groupService.getGroups(),
    this.departmentService.getDepartments()).subscribe(res => {
      console.log(res);
      if (res[0].length > 0) {res[0].forEach(e => {
        delete e.group;
      }); }
      this.listUser = res[0];
      // this.collectionSize = res[0].totalElements;
      // this.listCheckbox.length = res[0].length;
      this.listCheckbox.fill(false);
      // this.totalMoney = res[0].totalMoney;

      res[1].forEach(e => {delete e.departments; });
      this.listGroup = res[1];
      this.listDepartOrigin = res[2];
      this.loadingService.stopLoading();
    }, err => {
      this.loadingService.stopLoading();
    });

    this.loadingService.startLoading();
    this.userService.getUsers().subscribe(res => {
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

  chooseGroup() {
    // this.loadingService.startLoading();
    // this.groupService.getDepartByGroupId(this.groupSelected).subscribe(res => {
    //   this.listDepartment = res;
    //   this.loadingService.stopLoading();
    // }, err => {
    //   this.loadingService.stopLoading();
    // });
    this.listDepartment = this.listDepartOrigin.filter(e => e.groupId === this.groupSelected);
  }

  openModal(content, size, userId) {
    this.listDepartment = this.listDepartOrigin.slice(0);
    this.groupSelected = null;
    console.log(this.page);
    this.modalService.open(content, {size, centered: true });
    if (userId) {
      this.isEdit = true;
      this.loadingService.startLoading();
      this.userService.getUserById(userId).subscribe(res => {
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
      department: '',
      birthDate: null,
      gender: null,
      phone: null,
      role: null,
      passWord: '',
      userName: null,
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
    const userModel = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.userName,
      // department: user.department,
      birthDate: this.birthDate.toISOString(),
      gender: user.gender,
      phone: user.phone,
      userName: user.userName,
      role: user.role

    };
    this.loadingService.startLoading();
    this.userService.updateUser(userModel).subscribe(() => {
      this.getDataDefault();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  createUser(user) {
    const userModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.userName,
      // group: user.group,
      // department: user.department,
      birthDate: this.birthDate.toISOString(),
      gender: user.gender,
      phone: user.phone,
      role: user.role,
      userName: user.userName,
      passWord: user.passWord,
    };
    this.loadingService.startLoading();
    this.userService.addUser(userModel).subscribe(() => {
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
        this.userService.deleteUser(this.listDelete).subscribe(() => {
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
        this.userService.getExport().subscribe(res => {
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

