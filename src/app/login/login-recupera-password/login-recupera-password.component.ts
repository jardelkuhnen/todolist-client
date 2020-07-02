import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/_services/authentication.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-login-recupera-password',
  templateUrl: './login-recupera-password.component.html',
  styleUrls: ['./login-recupera-password.component.css']
})
export class LoginRecuperaPasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private messages: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private authenticationService: AuthenticationService) { }



  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  });

  ngOnInit(): void {
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {

    if (!this.loginForm.valid) {
      this.messages.open('Fields required!', "OK", {duration: 5000 });
      return;
    }

    if(!this.isSamePassword(this.f)){
      this.messages.open('Passwords are not equal!', "OK", {duration: 5000 });
      return;
    }
    
    let resetPassword = {
      email: this.f.email.value,
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value
    }

    this.authenticationService.resetPassword(resetPassword)
          .subscribe(
              data => {
                  this.router.navigateByUrl('/');
              },
              error => {
                  this.messages.open(error, "OK", {duration: 5000 });
                  return;
              });

  }

  isSamePassword(resetPassword) {
    return resetPassword.password.value === resetPassword.confirmPassword.value;
  }

}
