import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { Device } from '../models/device.model';
import {Pagination} from '../models/pagination.model';

@Injectable()
export class DeviceService {
  baseUrl = Constants.CONTEXT_PATH + 'device';

  constructor(private apiService: ApiService) {
  }

  getDevices(pagination: Pagination): Observable<any> {
    return this.apiService.get(`${this.baseUrl}`, pagination);
  }

  addDevice(device: Device): Observable<Device> {
    return this.apiService.post(this.baseUrl, device);
  }

  updateDevice(device: Device): Observable<Device> {
    return this.apiService.put(this.baseUrl, device);
  }

  deleteDevice(id: string): Observable<boolean> {
    return this.apiService.delete(this.baseUrl + '/' + id);
  }
}
