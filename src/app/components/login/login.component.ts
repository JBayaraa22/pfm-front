import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { makeToast } from 'src/app/shared/functions';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean
  user: User
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService
  ) { }

  ngOnInit() {
      this.loginForm = new FormGroup({
          username: new FormControl('', [Validators.required, Validators.minLength(4)]),
          password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      })
  }

  get getControls() {
      return this.loginForm.controls;
  }

  onSubmit() {
      this.loading = true
      if (this.loginForm.invalid) {
          makeToast("Хэрэглэгчийн нэр 4 өөс дээш урттай ,<br> нууц үг 8 аас дээш урттай байна", 'error')
      }
      else {
        let username = this.getControls.username.value
        let password = this.getControls.password.value
        this.authService.login(username , password).subscribe(data=>{
          if(data.token){
              makeToast("Амжилттай нэвтэрлээ" , "success")
              sessionStorage.setItem("currentUser" , JSON.stringify(data))
              this.loading = false
              this.router.navigate(['/user'])
          }
          else{
            makeToast("Нууц үг, хэрэглэгчийн нэр алдаатай байна" , "error")
            this.loading = false
          }
        } , error=>{
          makeToast(error.message , 'error')
          this.loading = false
        })
        this.loading = false
      }
      this.loading = false
  }

}
