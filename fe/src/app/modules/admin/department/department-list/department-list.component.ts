// import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../../../core/services/department.service';
import { GroupService } from '../../../../core/services/group.service';
import { Constants } from '../../../../constants-config';
// import { Pagination } from 'src/app/core/models/pagination.model';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { zip } from 'rxjs';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  department = {
    id: null,
    departId: '',
    departName: '',
    groupId: null
  };
  birthDate = new Date();
  startDate = new Date();
  isEdit = false;
  listDepartment = [];
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
  listGroup = [];

  constructor(private modalService: NgbModal,
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
    const pagination = {
      page: this.page,
      size: this.pageSize,
      fields: '',
      searchValue: this.searchCriterial.freeText,
      orderBy: 'asc',
      asc: false,
      type: this.searchCriterial.type,
      // fromDate: this.searchCriterial.fromDate ? this.searchCriterial.fromDate.toISOString() : null,
      // toDate: this.searchCriterial.toDate ? this.searchCriterial.toDate.toISOString() : null
    };
    this.loadingService.startLoading();
    zip(this.departmentService.getDepartments(pagination),
    this.groupService.getGroups(pagination)).subscribe(res => {
      console.log(res);
      // if (res[0].length > 0) {res[0].forEach(e => {
      //   delete e.group;
      // }); }
      this.listDepartment = res[0].content;
      this.collectionSize = res[0].totalElements;
      this.listCheckbox.length = res[0].content.length;
      this.listCheckbox.fill(false);

      // res[1].forEach(e => {delete e.departments; });
      this.listGroup = res[1].content;
      this.listDepartment.forEach(e => e.groupId = this.getGroupName(e.groupId));
      this.loadingService.stopLoading();
    }, err => {
      this.loadingService.stopLoading();
    });
  }

  getGroupName(id) {
    return this.listGroup.find(e => e.id === id).groupName;
  }

  getDepartList() {
    const pagination = {
      page: this.page,
      size: this.pageSize,
      fields: '',
      searchValue: this.searchCriterial.freeText,
      orderBy: 'asc',
      asc: false,
      type: this.searchCriterial.type,
    };
    this.departmentService.getDepartments(pagination).subscribe(res => {
      this.listDepartment = res.content;
      this.collectionSize = res.totalElements;
      this.listCheckbox.length = res.content.length;
      this.listCheckbox.fill(false);
    });
  }

  openModal(content, size, departId) {
    console.log(this.page);
    this.modalService.open(content, {size, centered: true });
    if (departId) {
      this.isEdit = true;
      this.loadingService.startLoading();
      this.departmentService.getDepartmentById(departId).subscribe(res => {
        this.department = res;
        console.log('department', res , this.department);
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
    this.department = {
      id: null,
      departId: '',
      departName: '',
      groupId: ''
    };
  }

  addDepartment(department, form): void {
    if (!form.invalid && form.submitted) {
      if (this.isEdit) {
        this.updateDepartment(department);
      } else {
        this.createDepartment(department);
        console.log(this.startDate);
      }
    }
  }

  updateDepartment(department) {
    const departmentModel = {
      id: department.id,
      departId: department.departId,
      departName: department.departName,
      groupId: department.groupId
    };
    this.loadingService.startLoading();
    this.departmentService.updateDepartment(departmentModel).subscribe(() => {
      this.getDepartList();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  createDepartment(department) {
    const departmentModel = {
      departId: department.departId,
      departName: department.departName,
      groupId: department.groupId
    };
    this.loadingService.startLoading();
    this.departmentService.addDepartment(departmentModel).subscribe(() => {
      this.getDepartList();
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

  doDelete(department) {
    console.log(department);
    if (department) {
    this.listDelete.push(department.id);
    console.log('listDelete', this.listDelete);
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
            this.listDelete.push(this.listDepartment[i].id);
          }
        }
        console.log('listDelete', this.listDelete);
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
        this.departmentService.deleteDepartment(this.listDelete).subscribe(() => {
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
    this.getDepartList();
  }

  doExport() {
    this.confirmationService.confirm({
      header: 'Xuất Dữ Liệu',
      message: 'Bạn có chắc chắn muốn xuất file Excel ?',
      accept: () => {
        this.loadingService.startLoading();
        this.departmentService.getExport().subscribe(res => {
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

