import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators'
import { makeToast } from 'src/app/shared/functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean
  loading: boolean
  user: any
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
      this.submitted = true
      let username = "demo"
      let password = "demo1234"
      if (this.loginForm.invalid) {
          makeToast("Хэрэглэгчийн нэр 4 өөс дээш урттай ,<br> нууц үг 8 аас дээш урттай байна", 'error')
          return
      }
      else {
        if(this.getControls.username.value == username && this.getControls.username.value == username){
          makeToast("Амжилттай нэвтэрлээ" , "success")
          this.router.navigate(['/user'])
        }
        else{
          makeToast("Нууц үг, хэрэглэгчийн нэр алдаатай байна" , "error")
        }
      }
  }

}
