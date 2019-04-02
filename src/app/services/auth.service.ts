import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { map ,catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  requestUrl : string
  apiUrl = environment.api
  constructor(private http : HttpClient) { 
    this.requestUrl = this.apiUrl.base + this.apiUrl.token
  }

  login(username , password){
    return this.http.post<User>(`${this.requestUrl}` , {username : username , password : password}).pipe(
      map(data=>{return data}),
      catchError(this.handleError) 
    )
  }

  
  private handleError(error : HttpErrorResponse){
    let message = ""
    if (error.error instanceof ErrorEvent){
      console.error('Алдаа гарлаа' , error.status)
    } else {
      switch(error.status){
        case 400:
          message = "Хэрэглэгчийн нэр эсвэл нууц үг буруу байна"
          break
        default:
          message =  "Сервертэй холбогдоход алдаа гарлаа"
      }
      return throwError({message : message , code : error.status})
    }
  }
}
