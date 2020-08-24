import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  get(url: any, param: any = {}): Observable<any> {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    for (const property of Object.keys(param)) {
      params = params.set(property, param[property]);
    }
    return this.http.get(url, { params: params }).pipe(
      map(this.extractData),
      finalize(() => {
      }));
  }

  post(url: any, body: any): Observable<any> {
    return this.http.post<any>(url, JSON.stringify(body), this.httpOptions).pipe(
      tap(),
      finalize(() => {
      })
    );
  }

  postOption(url: any, body: any, httpOption): Observable<any> {
    return this.http.post<any>(url, body, this.httpOptions
      //  {
      // headers: new HttpHeaders(
      //   httpOption
      // )
      // }
    ).pipe(
      tap(),
      finalize(() => {
      })
    );
  }

  put(url: any, body: any): Observable<any> {
    return this.http.put(url, JSON.stringify(body), this.httpOptions).pipe(
      tap(),
      finalize(() => {
      })
    );
  }

  delete(url: any, param: any = {}): Observable<any> {
    return this.http.delete<any>(url, { params: param }).pipe(
      tap(),
      finalize(() => {
      })
    );
  }

  patch(url: any, body: any): Observable<any> {
    return this.http.patch(url, JSON.stringify(body), this.httpOptions).pipe(
      tap(),
      finalize(() => {
      })
    );
  }

  private extractData(res: Response): any {
    const body = res;
    return body || {};
  }
}

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
