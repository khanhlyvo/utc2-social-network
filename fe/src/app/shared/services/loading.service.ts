import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
// tslint:disable-next-line: rx-subject-restrictions
  loadingStatus: Subject<boolean> = new Subject();

  private _loading = false;
// tslint:disable-next-line: typedef
  get loading() {
    return this._loading;
  }

  set loading(value: any) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  startLoading(): void {
    this.loading = true;
  }

  stopLoading(): void {
    this.loading = false;
  }
}
