import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Constants } from '../../../constants-config';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() size: number;
  @Input() totalCount: number;
  @Input() page: number;
  @Output() pageChange = new EventEmitter<any>();
  sizeList = Constants.SIZE_LIST;

  changeNumberSize(): void {
    this.page = 1;
    this.pageChange.emit({ page: this.page, size: this.size });
  }

  onPageChange(page: number, size: number): void {
    this.pageChange.emit({ page: page, size: size });
  }
}
