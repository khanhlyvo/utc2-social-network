import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Constants } from '../../constants-config';
import { ICard } from '../models/card.model';

@Injectable()
export class CardService {
  baseUrl = Constants.CONTEXT_PATH + 'card';

  constructor(private apiService: ApiService) {
  }

  getCards(pagination): Observable<any> {
    return this.apiService.get(this.baseUrl, pagination);
  }

  addCard(card: ICard): Observable<boolean> {
    return this.apiService.post(this.baseUrl, card);
  }

  updateCard(card: ICard): Observable<boolean> {
    return this.apiService.put(this.baseUrl, card);
  }

  deleteCard(Cards: ICard[]): Observable<boolean> {
    return this.apiService.put(`${this.baseUrl}/delete`, Cards);
  }

  getCardById(id: number): Observable<any> {
    return this.apiService.get(this.baseUrl + '/' + id);
  }

  getExport(): Observable<any> {
    return this.apiService.get(this.baseUrl + '/download');
  }
}
