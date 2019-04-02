import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  EXCLUDED_URL = ["account"]
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.token){
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${this.token}`
        }
      });
    }
    if (request.method === "GET" && !this.check(request.url) ) {
      let date_range = { start_date: "", end_date: "" }
      date_range = this.date_range
      if(date_range!== null){
        request = request.clone({
          setParams: {
            date_after: date_range.start_date,
            date_before: date_range.end_date
          }
        })
      }
    }
    return next.handle(request);
  }
  get date_range() {
    let date_range = sessionStorage.getItem("date_range")
    if(date_range)
      return JSON.parse(sessionStorage.getItem("date_range"))
    return null
  }
  get token() {
    let currentUser = sessionStorage.getItem("currentUser")
    if(currentUser===null)
      return null
    return JSON.parse(sessionStorage.getItem("currentUser"))["token"]
  }

  check(url : string){
    let found = false
    this.EXCLUDED_URL.forEach(segment => {
      if(url.includes(segment))
        found = true
    });
    
    return found
  }
}