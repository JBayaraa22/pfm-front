import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpErrorResponse, HttpParams , } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map, catchError, retry } from 'rxjs/operators'
import { Category } from '../models/category';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //Headers for requests
  RETRY_TIMES = 0
  apiUrl = environment.api.base+ environment.api.category

  constructor(private http : HttpClient) {
  }

  //Retrieve token from Local Storage
  get token(){
    return sessionStorage.getItem("token")
  }
  getAllCategories(): Observable<any>{
    let lsc = sessionStorage.getItem("categories")
    let categories : Category[]
    if(lsc)
    {
      categories = JSON.parse(lsc)
      return of(categories)
    }
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(data=>{
        sessionStorage.setItem("categories" , JSON.stringify(data))
        return data
    }))
  }

  updateCategory(data): Observable<any>{
    return this.http.put(`${this.apiUrl+data.id}/` , data ).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data=>{return data})
    ) 
  }

  createCategory(data) : Observable<any>{
    return this.http.post(`${this.apiUrl}` , data).pipe(
      retry(this.RETRY_TIMES),
      catchError(this.handleError),
      map(data=>{return data})
    )
  }

  deleteCategory(id) : Observable<any>{
    return this.http.delete(`${this.apiUrl + id}/` ).pipe(
      retry(this.RETRY_TIMES),
      map(data=>{return data}),
      catchError(this.handleError)
    )
  }
  getCategoryTotal() : Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}total/`).pipe(
      retry(this.RETRY_TIMES),
      map(data=>{ return data}),
      catchError(this.handleError)
    )
  }
  private handleError(error : HttpErrorResponse){
    let message = ""
    switch (error.status) {
      case 400:
        message = "Алдаа гарлаа оруулсан утгаа шалгана уу."
        break;
      case 404:
        message = "Ангилал олдсонгүй."
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
