import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Budget } from '../models/budget';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  headers: HttpHeaders
  requestOptions = { headers: this.headers }
  RETRY_TIMES = 0

  apiUrl = environment.api.base + environment.api.budget

  constructor(private http: HttpClient) { }

  getAllBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}`, this.requestOptions).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => {
        return data
      })
    )
  }
  createBudget(data): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}`, data, this.requestOptions).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => { return data })
    )
  }

  updateBudget(data): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl + data.id}/`, data, this.requestOptions).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data => { return data })
    )
  }

  deleteBudget(id) {
    return this.http.delete(`${this.apiUrl + id}/`, this.requestOptions).pipe(
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
        message = "Төсөв олдсонгүй."
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
