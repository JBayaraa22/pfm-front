import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders , } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'
import { Category } from '../models/category';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  headers : HttpHeaders
  requestOptions = { headers : this.headers }
  constructor(private http : HttpClient) {
    this.headers = new HttpHeaders()
  }

  getAllCategories(): Observable<Category[]>{
    let lsc = localStorage.getItem("categories")
    let categories : Category[]
    if(lsc)
    {
      console.log("Fetching from Local storage")
      categories = JSON.parse(lsc)
      return of(categories)
    }
    console.log("Fetching from API")
    return this.http.get<any>(`${environment.apiBase}categories.json`).pipe(
      map(data=>{
        return data
    }))
  }


}
