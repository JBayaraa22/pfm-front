import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Raw } from '../models/transaction';
import { Observable, of, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { CustomAccount } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  RETRY_TIMES = 0
  apiUrl = environment.api.base + environment.api.transaction

  constructor(private http: HttpClient) { }

  get token() {
    return sessionStorage.getItem("token")
  }
  getRecentTransactions(pageNumber, filters): Observable<Raw[]> {
    Object.keys(filters).forEach(fname => {
      if(filters[fname] == ''){
        delete filters[fname]
      }
    });
    return this.http.get<Raw[]>(`${this.apiUrl}?page=${pageNumber}`, { params: filters }).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => {
        return data
      })
    )
  }

  getRawTotal(): Observable<{}> {
    return this.http.get<any[]>(`${this.apiUrl}total/`).pipe(
      catchError(this.handleError),
      map(data => {
        let raw_total = {
          debit : 0,
          credit : 0
        }
        data.forEach(d => {
          if(d.tran_part == "D")
            raw_total.debit = d.actual
          if(d.tran_part == "C")
            raw_total.credit = d.actual
        });
        return raw_total
      })
    )
  }

  updateTransaction(data): Observable<Raw> {
    return this.http.patch<Raw>(`${this.apiUrl + data.id}/`, data).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => {
        return data
      })
    )
  }

  createTransaction(data): Observable<Raw> {
    return this.http.post<Raw>(`${this.apiUrl}`, data).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => {
        return data
      })
    )
  }

  deleteTransaction(id, isDeleted) {
    return this.http.patch(`${this.apiUrl + id}/`, { deleted: isDeleted }).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => {
        return data
      })
    )
  }

  getAccountList(): Observable<CustomAccount[]> {
    return this.http.get<CustomAccount[]>(`${environment.api.base}transaction/account/`).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => { return data })
    )
  }

  changeAccountVisibleFlag(account) {
    return this.http.patch(`${environment.api.base}/transaction/account/${account.id}/`, { visible_flg: account.visible_flg }).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => { return data })
    )
  }

  private handleError(error: HttpErrorResponse) {
    let message = ""
    switch (error.status) {
      case 400:
        message = "Алдаа гарлаа оруулсан утгаа шалгана уу."
        break;
      case 404:
        message = "Гүйлгээ олдсонгүй."
        break;
      case 403:
        message = "Дахин нэвтэрнэ үү."
        break;
      default:
        message = 'Сервертэй холбогдоход алдаа гарлаа'
    }
    return throwError({message : message , code : error.status})
  }
}
