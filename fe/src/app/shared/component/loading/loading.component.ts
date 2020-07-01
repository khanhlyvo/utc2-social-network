import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loading = false;
  loadingSubscription: Subscription;

  constructor(private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
