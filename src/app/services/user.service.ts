import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }
  getDateRange() : Date[]{
    let date = JSON.parse(sessionStorage.getItem("date_range"))
    if(date)
      return date
    return null
  }
}
