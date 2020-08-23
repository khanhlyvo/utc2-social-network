// import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupService } from '../../../../core/services/group.service';
import { Constants } from '../../../../constants-config';
// import { Pagination } from 'src/app/core/models/pagination.model';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ConfirmationService, MessageService } from 'primeng/api';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  group = {
    id: null,
    groupId: '',
    groupName: ''
  };
  birthDate = new Date();
  startDate = new Date();
  isEdit = false;
  listGroup = [];
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
      orderBy: '',
      asc: false,
      type: this.searchCriterial.type,
    };
    this.loadingService.startLoading();
    this.groupService.getGroups(pagination).subscribe(res => {
      console.log(res);
      this.listGroup = res.content;
      this.collectionSize = res.totalElements;
      this.listCheckbox.length = res.content.length;
      this.listCheckbox.fill(false);
      this.totalMoney = res.totalMoney;
      this.loadingService.stopLoading();
    }, err => {
      this.loadingService.stopLoading();
    });
  }

  openModal(content, size, GroupId) {

    console.log(this.page);
    this.modalService.open(content, {size, centered: true });
    if (GroupId) {
      this.isEdit = true;
      this.loadingService.startLoading();
      this.groupService.getGroupById(GroupId).subscribe(res => {
        this.group = res;
        console.log("group", res , this.group);
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
    this.group = {
      id: null,
      groupId: '',
      groupName: ''
    };
  }

  addGroup(group, form): void {
    if (!form.invalid && form.submitted) {
      if (this.isEdit) {
        this.updateGroup(group);
      } else {
        this.createGroup(group);
        console.log(this.startDate);
      }
    }
  }

  updateGroup(group) {
    const GroupModel = {
      id: group.id,
      groupId: group.groupId,
      groupName: group.groupName
    };
    this.loadingService.startLoading();
    this.groupService.updateGroup(GroupModel).subscribe(() => {
      this.getDataDefault();
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    }, err => {
      this.modalService.dismissAll();
      this.loadingService.stopLoading();
    });
  }

  createGroup(group) {
    const GroupModel = {
      groupId: group.groupId,
      groupName: group.groupName
    };
    this.loadingService.startLoading();
    this.groupService.addGroup(GroupModel).subscribe(() => {
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

  doDelete(group) {
    console.log(group);
    if (group) {
    this.listDelete.push(group.id);
    console.log("listDelete", this.listDelete);
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
            this.listDelete.push(this.listGroup[i].id);
          }
        }
        console.log("listDelete", this.listDelete);
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
        this.groupService.deleteGroup(this.listDelete).subscribe(() => {
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
        this.groupService.getExport().subscribe(res => {
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

