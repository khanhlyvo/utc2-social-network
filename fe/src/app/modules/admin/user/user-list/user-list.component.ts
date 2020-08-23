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
import { ImportUser } from '../../../../core/models/user.model';
import { ExcelService } from '../../../../core/services/excel.service';

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
  listGroup = [];
  groupSelected = null;
  selectedDepartment = null;
  // importUsers  = [];
  // exportUsers = [];
  file: File;

  constructor(private modalService: NgbModal,
              private readonly userService: UserService,
              private readonly departmentService: DepartmentService,
              private readonly groupService: GroupService,
              private readonly loadingService: LoadingService,
              private readonly confirmationService: ConfirmationService,
              private readonly messageService: MessageService,
              private excelSrv: ExcelService) {}

  ngOnInit() {
    this.getDataDefault();
    console.log(this.page, this.pageSize);
  }

  getDataDefault() {
    this.isCheckAll = false;
    const pagination = {
      page: this.page,
      size: this.pageSize,
      fields: '',
      searchValue: this.searchCriterial.freeText,
      orderBy: 'asc',
      asc: false,
      type: this.searchCriterial.type,
    };
    zip(this.userService.getUsers(pagination),
    this.groupService.getGroups({...pagination, page: 0, size: 0, searchValue: ''}),
    this.departmentService.getDepartments({...pagination, page: 0, size: 0, searchValue: ''})).subscribe(res => {
      console.log(res);
      // if (res[0].length > 0) {res[0].forEach(e => {
      //   delete e.group;
      // }); }
      this.listUser = res[0].content;
      this.collectionSize = res[0].totalElements;
      this.listCheckbox.length = res[0].content.length;
      this.listCheckbox.fill(false);

      res[1].content.forEach(e => {delete e.users; });
      res[2].content.forEach(e => {delete e.users; });
      this.listGroup = res[1].content;
      this.listDepartOrigin = res[2].content;
      this.loadingService.stopLoading();
    }, err => {
      this.loadingService.stopLoading();
    });

    // this.loadingService.startLoading();
    // this.userService.getUsers().subscribe(res => {
    //   console.log(res);
    //   this.listUser = res;
    //   this.collectionSize = res.totalElements;
    //   this.listCheckbox.length = res.length;
    //   this.listCheckbox.fill(false);
    //   this.totalMoney = res.totalMoney;
    //   this.loadingService.stopLoading();
    // }, err => {
    //   this.loadingService.stopLoading();
    // });
  }

  getUsers() {
    const pagination = {
      page: this.page,
      size: this.pageSize,
      fields: '',
      searchValue: this.searchCriterial.freeText,
      orderBy: 'asc',
      asc: false,
      type: this.searchCriterial.type,
    };
     this.loadingService.startLoading();
    this.userService.getUsers(pagination).subscribe(res => {
      console.log(res);
      this.listUser = res.content;
      this.collectionSize = res.totalElements;
      this.listCheckbox.length = res.content.length;
      this.listCheckbox.fill(false);
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
    this.listDepartment = this.listDepartOrigin.filter(e => e.groupId === this.groupSelected.id);

  }

  openModal(content, size, userId) {
    this.listDepartment = this.listDepartOrigin.slice(0);
    console.log("listDepartment", this.listDepartment);
    this.groupSelected = null;
    console.log(this.page);
    this.modalService.open(content, {size, centered: true });
    if (userId) {
      this.isEdit = true;
      this.loadingService.startLoading();
      this.userService.getUserById(userId).subscribe(res => {
        this.user = res;
        delete res.department.users;
        this.selectedDepartment = res.department;
        this.groupSelected = this.listGroup.find(e => e.id === res.department.groupId);
        console.log("groupSelected", this.groupSelected);
        console.log("user", res);
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
    this.selectedDepartment = null;
    this.groupSelected = null;
  }

  doImport(evt) {
    console.log(evt);
    const file = evt.target.files[0];
    let input = new FormData();
  // Add your values in here
  input.append('file', file);
  // etc, etc
    this.userService.addListUser(input).subscribe(() => {
      console.log(1);
      this.getUsers();
    });
// Add your values in here
    // const target: DataTransfer = <DataTransfer>(evt.target);
    // if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    // const reader: FileReader = new FileReader();
    // reader.onload = (e: any) => {

    //   const bstr: string = e.target.result;
    //   const data = <any[]>this.excelSrv.importFromFile(bstr);

    //   const header: string[] = Object.getOwnPropertyNames(new ImportUser());
    //   const importedData = data.slice(1, -1);

    //   this.importUsers = importedData.map(arr => {
    //     const obj = {};
    //     for (let i = 0; i < header.length; i++) {
    //       const k = header[i];
    //       obj[k] = arr[i];
    //     }
    //     return <ImportUser>obj;
    //   });
    //   console.log(this.importUsers);

    // };
    // reader.readAsBinaryString(target.files[0]);
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
      department: this.selectedDepartment,
      birthDate: this.birthDate.toISOString(),
      gender: user.gender,
      phone: user.phone,
      userName: user.userName,
      role: user.role

    };
    this.loadingService.startLoading();
    this.userService.updateUser(userModel).subscribe(() => {
      this.getUsers();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  createUser(user) {
    const userModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.userName,
      // group: user.group,
      department: this.selectedDepartment,
      birthDate: this.birthDate.toISOString(),
      gender: user.gender,
      phone: user.phone,
      role: user.role,
      userName: user.userName,
      passWord: user.passWord,
    };
    this.loadingService.startLoading();
    this.userService.addUser(userModel).subscribe(() => {
      this.getUsers();
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
    this.getUsers();
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
          this.getUsers();
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
    this.getUsers();
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

